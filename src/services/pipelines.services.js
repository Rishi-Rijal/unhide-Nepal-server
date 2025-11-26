import mongoose from 'mongoose';


const buildMatchStage = (filters) => {
    const { categories, tags, minRating, difficulty, verifiedOnly } = filters;
    const match = {};

    if (verifiedOnly) match.isVerified = true;
    if (categories?.length) match.categories = { $in: categories };
    if (tags?.length) match.tags = { $in: tags };
    if (minRating !== undefined) match.averageRating = { $gte: minRating };
    if (difficulty) match.difficulty = difficulty;

    return match;
};

const buildCursorStage = (decodedCursor, sort) => {
    if (!decodedCursor) return {};
    const c = decodedCursor;
    const objectId = mongoose.Types.ObjectId.createFromHexString(c._id);

    const dateLt = { $lt: new Date(c.createdAt) };
    const idLt = { $lt: objectId };

    //  Newest (Default)
    if (sort === "newest" || !sort) {
        return {
            $or: [
                { createdAt: dateLt },
                { createdAt: new Date(c.createdAt), _id: idLt },
            ],
        };
    }

    // Rating Desc
    if (sort === "rating_desc") {
        return {
            $or: [
                { averageRating: { $lt: c.averageRating } },
                { averageRating: c.averageRating, createdAt: dateLt },
                { averageRating: c.averageRating, createdAt: new Date(c.createdAt), _id: idLt },
            ],
        };
    }

    // Rating Ascending
    if (sort === "rating_asc") {
        return {
            $or: [
                { averageRating: { $gt: c.averageRating } },
                { averageRating: c.averageRating, createdAt: dateLt },
                { averageRating: c.averageRating, createdAt: new Date(c.createdAt), _id: idLt },
            ],
        };
    }

    // Likes Desc
    if (sort === "likes_desc") {
        return {
            $or: [
                { likesCount: { $lt: c.likesCount } },
                { likesCount: c.likesCount, createdAt: dateLt },
                { likesCount: c.likesCount, createdAt: new Date(c.createdAt), _id: idLt },
            ],
        };
    }

    // Likes Asc
    if (sort === "likes_asc") {
        return {
            $or: [
                { likesCount: { $gt: c.likesCount } },
                { likesCount: c.likesCount, createdAt: dateLt },
                { likesCount: c.likesCount, createdAt: new Date(c.createdAt), _id: idLt },
            ],
        };
    }

    // Distance
    if (sort === "distance") {
        return {
            $or: [
                { distanceMeters: { $gt: c.distanceMeters } },
                { distanceMeters: c.distanceMeters, averageRating: { $lt: (c.averageRating ?? 0) } },
                { distanceMeters: c.distanceMeters, averageRating: (c.averageRating ?? 0), createdAt: dateLt },
                { distanceMeters: c.distanceMeters, averageRating: (c.averageRating ?? 0), createdAt: new Date(c.createdAt), _id: idLt },
            ],
        };
    }

    return {};
};

const buildSortStage = (sort) => {
    const baseSort = { createdAt: -1, _id: -1 };

    switch (sort) {
        case "rating_desc": return { averageRating: -1, ...baseSort };
        case "rating_asc": return { averageRating: 1, ...baseSort };
        case "likes_desc": return { likesCount: -1, ...baseSort };
        case "likes_asc": return { likesCount: 1, ...baseSort };
        case "distance": return { distanceMeters: 1, averageRating: -1, ...baseSort };
        default: return baseSort; // newest
    }
};

const generateNextCursorData = (lastItem, sort) => {
    const baseCursor = { createdAt: lastItem.createdAt, _id: lastItem._id };

    if (sort === "rating_desc" || sort === "rating_asc") {
        return { ...baseCursor, averageRating: lastItem.averageRating ?? 0 };
    }
    if (sort === "likes_desc" || sort === "likes_asc") {
        return { ...baseCursor, likesCount: lastItem.likesCount ?? 0 };
    }
    if (sort === "distance") {
        return { ...baseCursor, distanceMeters: lastItem.distanceMeters ?? 0, averageRating: lastItem.averageRating ?? 0 };
    }

    return baseCursor;
};

export {
    buildMatchStage,
    buildCursorStage,
    buildSortStage,
    generateNextCursorData
};