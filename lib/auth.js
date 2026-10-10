import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  balance: { type: Number, default: 0 },
  adsWatchedToday: { type: Number, default: 0 },
  totalAdsWatched: { type: Number, default: 0 },
  lastAdResetAt: { type: Date, default: Date.now },
  referralCode: { type: String, unique: true },
  referredBy: { type: String, default: null },
  referrals: [{ type: String }],
  referralEarnings: { type: Number, default: 0 },
  banned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const CommentSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  username: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, default: 5 },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const WithdrawalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: String,
  amount: Number,
  method: String,
  address: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
export const Withdrawal = mongoose.models.Withdrawal || mongoose.model("Withdrawal", WithdrawalSchema);