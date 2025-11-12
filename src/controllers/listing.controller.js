import { url } from 'inspector';
import Listing from '../models/listing.model.js';
import ApiError from '../utils/ApiError.js';
import AsyncHandler from '../utils/AsyncHandler.js';
import { uploadOnCloudinary } from '../utils/uploadCloudinary.js';


// create a new listing

const createListing = AsyncHandler(async(req, res)=>{
    const {name, description, category, tags, latitude, longitude, tips} = req.body;

    if(!name || !description || !category || !latitude || !longitude){
        throw new ApiError(400, 'Please provide all required fields');
    }

    const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
    };

    const images = req.files?.images || [];

    const imagesInfo = await Promise.all(
        images.map(async(image)=>{
            const uploadResult = await uploadOnCloudinary(image.path);
            return {url: uploadResult.secure_url, public_id: uploadResult.public_id, format: uploadResult.format};
        })
    );

     // print imagesInfo to console
    console.log(imagesInfo[0]);


    const newListing = await Listing.create({
        name,
        description,
        category,
        tags,
        location,
        images: imagesInfo,
        extraAdvice: tips
    });

    const createdListing = Listing.findById(newListing._id);
    if(!createdListing){
        throw new ApiError(500, 'Failed to create listing');
    }

    res.status(201).json(newListing);
});

const getListings = AsyncHandler(async(req, res)=>{
    const listings = await Listing.find();
    res.status(200).json(listings);
});

const getListing = AsyncHandler(async(req, res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        throw new ApiError(404, 'Listing not found');
    }

    res.status(200).json(listing);
});

const updateListing = AsyncHandler(async(req, res)=>{
    const {id} = req.params;
    const {name, description, category, tags, latitude, longitude, photos, tips} = req.body;
    if(!name || !description || !category || !latitude || !longitude){
        throw new ApiError(400, 'Please provide all required fields');
    }

    const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
    };
    const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body, location}, {new: true});
    if(!updatedListing){
        throw new ApiError(404, 'Listing not found');
    }

    res.status(200).json(updatedListing);
});

const deleteListing = AsyncHandler(async(req, res)=>{
    const {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if(!deletedListing){
        throw new ApiError(404, 'Listing not found');
    }

    res.status(200).json({ message: 'Listing deleted successfully' });
});

export { createListing, getListings, getListing, updateListing, deleteListing };