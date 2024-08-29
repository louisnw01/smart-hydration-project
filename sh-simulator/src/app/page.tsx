"use client";

import { useEffect, useState } from "react";

const LOCAL_SERVER_URL = "https://hydrationapi.louisnw.com/simulator";

export default function Home() {
    const [dbValue, setDbValue] = useState(0);
    const [value, setValue] = useState(0);

    const fetchWaterLevel = () => {
        fetch(LOCAL_SERVER_URL + "/latest")
            .then((res) => res.json())
            .then((data) => {
                setValue(data);
                setDbValue(data);
            });
    };

    useEffect(() => {
        fetchWaterLevel();
    }, []);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const updateValue = async () => {
        const res = await fetch(LOCAL_SERVER_URL + "/update-level", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ level: parseInt(value) }),
        });

        if (res.ok) {
            setDbValue(value);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-5">
            <div className="">Jug simulator</div>
            <p>Current value: {dbValue}ml</p>
            <p>Value: {value}ml</p>
            <div className="w-72">
                <input
                    type="range"
                    min="0"
                    max="1100"
                    value={value}
                    onChange={handleChange}
                    className="appearance-none bg-gray-200 focus:outline-none h-1 w-full rounded-full"
                />
            </div>
            <button
                className="bg-blue-500 px-4 py-2 rounded-lg mt-10"
                onTouchStart={() => updateValue()}
                onClick={() => updateValue()}
            >
                Update
            </button>
        </main>
    );
}
