import mongoose from 'mongoose';
import { format } from 'path';

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Adventure', 'Nature', 'Culture', 'Relaxation', 'Family', 'Romance']
    },
    tags: [String],

    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [{
        url: String,
        public_id: String,
        format: String
    }],
    permitsRequired: {
        type: Boolean,
        default: false
    },
    bestSeason: {
        type: [String]

    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Challenging', 'Hard']
    },
    extraAdvice: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

listingSchema.index({ location: '2dsphere' });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;