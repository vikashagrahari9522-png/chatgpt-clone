const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

let chatGptIndex;

async function initializeIndex() {
    const indexList = await pc.listIndexes();

    const indexInfo = indexList.indexes.find(
        (index) => index.name === "chatforme"
    );

    if (!indexInfo) {
        throw new Error("Pinecone index 'chatforme' not found");
    }

    console.log("Pinecone index host:", indexInfo.host);

    chatGptIndex = pc.index({
        host: indexInfo.host
    });
}

async function createMemory({ vectors, metadata, messageId }) {

    if (!chatGptIndex) {
        await initializeIndex();
    }

    if (!Array.isArray(vectors) || vectors.length === 0) {
        throw new Error(
            "createMemory: vectors must be a non-empty array"
        );
    }

    if (!messageId) {
        throw new Error(
            "createMemory: messageId is required"
        );
    }

    const record = {
        id: String(messageId),
        values: vectors,
        metadata: metadata
    };

    console.log("Pinecone record ID:", record.id);
    console.log("Vector length:", record.values.length);

    await chatGptIndex.upsert({
        records: [record]
    });

    console.log("Successfully stored vector in Pinecone");
}

async function queryMemory({
    queryVectors,
    limit = 5,
    metadata
}) {

    if (!chatGptIndex) {
        await initializeIndex();
    }

    if (!Array.isArray(queryVectors) || queryVectors.length === 0) {
        throw new Error(
            "queryMemory: queryVectors must be a non-empty array"
        );
    }

    const queryOptions = {
        vector: queryVectors,
        topK: limit,
        includeMetadata: true
    };

    if (metadata) {
        queryOptions.filter = {
            chat: {
                $eq: metadata.chat
            }
        };
    }

    const data = await chatGptIndex.query(queryOptions);

    return data.matches;
}

module.exports = {
    createMemory,
    queryMemory
};