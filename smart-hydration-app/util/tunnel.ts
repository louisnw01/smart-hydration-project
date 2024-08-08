import { isMeasuringNewCupSizeAtom } from "@/atom/device";
import { getJugDataQAtom } from "@/atom/query";
import { authTokenAtom } from "@/atom/user";
import { DeviceInfo } from "@/interfaces/device";
import { atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { queryClientAtom } from "jotai-tanstack-query";
import { SERVER_ADDRESS } from "./fetch";

enum MessageType {
    CONNECT = 1,
    SUBSCRIBE = 2,
    UNSUBSCRIBE = 3,
    OK = 4,
    ERROR = 5,
    EVENT = 6,
}

class TunnelClient {
    private subscribers: any = {};
    private ws: WebSocket | null = null;
    private clientKey: string;
    public isConnected: boolean = false;
    private toSend: any[] = [];

    constructor(address: string, key: string) {
        this.ws = new WebSocket(address);
        this.clientKey = key;

        this.ws.onopen = (event: Event) => {
            this.ws?.send(JSON.stringify([MessageType.CONNECT, key]));
            this.isConnected = true;
            for (const obj of this.toSend) {
                this.send(obj);
            }
        };

        this.ws.onmessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            const type = message[0];

            if (type == MessageType.EVENT) {
                const name = message[1];
                const data = message[2];
                this.subscribers[name](data);
            }

            const data = message[1];
            console.log(
                `[${type == 4 ? "OK" : type == 5 ? "ERROR" : null}] ${data}`,
            );
        };

        this.ws.onclose = (event: CloseEvent) => {
            this.isConnected = false;
            console.log("WebSocket is closed now.", event.reason);
        };

        this.ws.onerror = (event: Event) => {
            console.error("WebSocket error observed:", event);
        };
    }

    private send(obj: any[]) {
        if (!this.isConnected) {
            this.toSend.push(obj);
        } else {
            this.ws?.send(JSON.stringify(obj));
        }
    }

    disconnect() {
        this.ws?.close();
    }

    subscribe(name: string, variable: string, handler: (data: any) => void) {
        this.subscribers[name] = handler;
        this.send([MessageType.SUBSCRIBE, this.clientKey, name, variable]);
    }

    unsubscribe(name: string, variable: string) {
        this.send([MessageType.UNSUBSCRIBE, this.clientKey, name, variable]);
    }
}

export const tunnelAtom = atom<TunnelClient | null>(null);

export const tunnelInitEAtom = atomEffect((get, set) => {
    get(subscribeToJugDataEAtom);

    const authToken = get(authTokenAtom);
    if (!authToken) return;

    const tunnel = new TunnelClient(
        `ws://${SERVER_ADDRESS}/tunnel/`,
        authToken,
    );

    set(tunnelAtom, tunnel);
});

export const subscribeToJugDataEAtom = atomEffect((get, set) => {
    const tunnel = get(tunnelAtom);
    if (!tunnel) return;
    const queryClient = get(queryClientAtom);

    const handleJugData = (newJugData: DeviceInfo) => {
        const { data: jugsLatest } = get(getJugDataQAtom);
        if (!jugsLatest) {
            return;
        }
        const row = jugsLatest.find((row) => row.id == newJugData.id);
        if (!row) {
            return;
        }

        const jugIdOfMeasuringJug = get(isMeasuringNewCupSizeAtom);

        if (jugIdOfMeasuringJug && jugIdOfMeasuringJug == newJugData.id) {
            const diff = row.water_level - newJugData.water_level;
            if (diff <= 0) {
                return;
            }
            // we can take this diff as the cup size
            alert(`todo: implement custom cup size of ${diff}`);
        }

        queryClient.setQueryData(
            ["get-jug-data", get(authTokenAtom)],
            (prev: DeviceInfo[]) =>
                prev.map((row) =>
                    row.id == newJugData.id ? { ...row, ...newJugData } : row,
                ),
        );
    };

    tunnel?.subscribe("all-jugs-latest", get(authTokenAtom), handleJugData);

    return () => {
        const tunnel = get(tunnelAtom);
        tunnel?.unsubscribe("all-jugs-latest", get(authTokenAtom));
        tunnel?.disconnect();
    };
});
