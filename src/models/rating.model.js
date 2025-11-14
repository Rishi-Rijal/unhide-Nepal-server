const ratingSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        trim: true
    },

    userDisplayName: String,
    userAvatarUrl: String,

    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

ratingSchema.index({ userId: 1, listingId: 1 }, { unique: true });
// helpful sorts & filters
ratingSchema.index({ listingId: 1, createdAt: -1 });
ratingSchema.index({ userId: 1, createdAt: -1 });


const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;