import os
from enum import Enum
from logging import getLogger
from typing import Mapping, Optional, Union

from motor.core import AgnosticCollection, AgnosticDatabase
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.results import InsertOneResult, UpdateResult

log = getLogger(__name__)

MONGODB_URI = os.getenv("MONGODB_URI")
MONGO_CLIENT = AsyncIOMotorClient(MONGODB_URI)
DB: AgnosticDatabase = MONGO_CLIENT["hackuci"]


class Collection(str, Enum):
    USERS = "users"
    TESTING = "testing"


async def insert(
    collection: Collection, data: Mapping[str, object]
) -> Union[str, bool]:
    """Insert a document into the specified collection of the database"""
    COLLECTION: AgnosticCollection = DB[collection.value]
    result: InsertOneResult = await COLLECTION.insert_one(data)
    if not result.acknowledged:
        log.error("MongoDB document insertion was not acknowledged")
        raise RuntimeError("Could not insert document into MongoDB collection")
    new_document_id: str = result.inserted_id
    return new_document_id


async def retrieve_one(
    collection: Collection, query: Mapping[str, object], fields: list[str] = []
) -> Optional[dict[str, object]]:
    """Search for and retrieve the specified fields of all documents (if any exist)
    that satisfy the provided query."""
    COLLECTION = DB[collection.value]

    result: Optional[dict[str, object]] = await COLLECTION.find_one(query, fields)
    return result


async def retrieve(
    collection: Collection, query: Mapping[str, object], fields: list[str] = []
) -> list[dict[str, object]]:
    """Search for and retrieve the specified fields of a document (if any exist)
    that satisfy the provided query."""
    COLLECTION = DB[collection.value]

    result = COLLECTION.find(query, fields)
    output: list[dict[str, object]] = await result.to_list(length=None)
    return output


async def update_one(
    collection: Collection, query: Mapping[str, object], new_data: Mapping[str, object]
) -> bool:
    """Search for and update a document (if it exists) using the provided query data."""
    COLLECTION = DB[collection.value]
    result: UpdateResult = await COLLECTION.update_one(query, {"$set": new_data})
    if not result.acknowledged:
        log.error("MongoDB document update was not acknowledged")
        raise RuntimeError("Could not update documents in MongoDB collection")

    return result.modified_count > 0


async def update(
    collection: Collection, query: Mapping[str, object], new_data: Mapping[str, object]
) -> bool:
    """Search for and update documents (if they exist) using the provided query data."""
    COLLECTION = DB[collection.value]
    result: UpdateResult = await COLLECTION.update_many(query, {"$set": new_data})
    if not result.acknowledged:
        log.error("MongoDB document update was not acknowledged")
        raise RuntimeError("Could not update documents in MongoDB collection")

    return result.modified_count > 0