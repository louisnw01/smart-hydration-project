import hashlib


def get_hash(string: str):
    hash_object = hashlib.sha512(string.encode())
    return hash_object.hexdigest()
