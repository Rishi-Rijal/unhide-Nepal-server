import { z } from "zod";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Agent, tool, run } from '@openai/agents';
import { getAllListingsService, createListingService } from "../services/listing.services.js";
import { TAGS, CATEGORY_ENUM } from "../models/listing.model.js";
import ApiError from "../utils/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const AGENT_TIMEOUT = 120000; // 60 seconds

const SERVER_URI = process.env.SERVER_URI;

function formatImagesForListing() {
    const imageUrl = "https://res.cloudinary.com/dabnlfeh9/image/upload/v1764165495/rmgsiv14nbuxc067x7ly.avif";
    
    return [
        {
            url: imageUrl,
            public_id: "rmgsiv14nbuxc067x7ly",
            format: "avif",
        },
        {
            url: imageUrl,
            public_id: "rmgsiv14nbuxc067x7ly",
            format: "avif",
        }
    ];
}

const addListingTool = tool({
    name: 'add_listing',
    description: 'Add a new listing to the database with all the required details',
    parameters: z.object({
        author: z.string().describe('ID of the user adding the listing'),
        name: z.string().describe('Name of the listing'),
        description: z.string().describe('describe of the listing'),
        categories: z.array(z.string()).describe('Categories of the listing'),
        tags: z.array(z.string()).describe('Tags associated with the listing'),
        latitude: z.number().describe('Latitude of the listing location'),
        longitude: z.number().describe('Longitude of the listing location'),
        permitsRequired: z.boolean().describe('Whether permits are required for this listing'),
        permitsDescription: z.string().describe('description of the permits required'),
        bestSeason: z.string().describe('Best season to visit the listing'),
        difficulty: z.string().describe('Difficulty level of the listing'),
        extraAdvice: z.string().describe('Any extra advice for visitors'),
        physicalAddress: z.string().describe('Physical address of the listing')
    }),
    execute: async (params) => {
        const uploadedImages = formatImagesForListing();
        
        const newListing = await createListingService({
            ...params,
            uploadedImages
        });
        
        return `Listing added successfully with ID: ${newListing._id}`;
    }
});

const getListingTool = tool({
    name: 'get_listing',
    description: 'Get all the listings from the database',
    parameters: z.object({}),
    execute: async () => {
        const allListings = await getAllListingsService();
        return `Retrieved ${allListings.length} listings from the database. and here are the listings: ${JSON.stringify(allListings)}`;
    },
});

const addListingAgent = new Agent({
    name: " Add Lising Agent ",
    instructions: "Agent to add a new listing to the database",
    tools: [addListingTool, getListingTool],
})

const runAddListingAgent = async (input: string) => {
    const response = await run(addListingAgent, input);
    return response.finalOutput;
}

export const testAddListingAgent = async (place: string, authorId: string) => {
    if (!place || typeof place !== 'string' || place.trim().length === 0) {
        throw new ApiError(400, 'Valid place name is required');
    }
    
    if (place.trim().length > 100) {
        throw new ApiError(400, 'Place name too long (max 100 characters)');
    }
    
    const sanitizedPlace = place.trim();
    const author = authorId ;
    
    console.log(`[AI Agent] Starting listing creation for: ${sanitizedPlace}`);
    
    try {
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Agent timeout')), AGENT_TIMEOUT)
        );
        
        const agentPromise = runAddListingAgent(
            `Add {${sanitizedPlace}} to the database. Define the name, description, categories, tags, location (latitude and longitude), permits required (true/false), permits description, best season, difficulty(Easy, Moderate, Challenging, Extreme), extra advice, physical address. The author ID is ${author} and Strictly use the following categories: ${CATEGORY_ENUM.join(", ")} and the following tags: ${TAGS.join(", ")}. Use following difficulty levels: Easy, Moderate, Challenging, Extreme. Use appropriate values for each field.`
        );
        
        const response = await Promise.race([agentPromise, timeoutPromise]);
        
        console.log(`[AI Agent] Successfully created listing for: ${sanitizedPlace}`);
        return response;
    } catch (error: any) {
        console.error(`[AI Agent] Error creating listing for ${sanitizedPlace}:`, error);
        
        if (error.message === 'Agent timeout') {
            throw new ApiError(408, 'AI agent took too long to respond. Please try again.');
        }
        
        if (error.message?.includes('OpenAI')) {
            throw new ApiError(503, 'AI service temporarily unavailable. Please try again later.');
        }
        
        throw new ApiError(500, 'Failed to create listing with AI agent');
    }
};


