import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    businessName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false, 
    },
    documents: [
      {
        type: String,
      }
    ],
    profilePic: {
      type: String,
      default: "https://img.myloview.com/stickers/default-avatar-profile-icon-vector-social-media-user-photo-700-205577532.jpg",
    },
    rating: {
      type: Number,
      default: 0, 
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
