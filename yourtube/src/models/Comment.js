import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    videoid: { type: String, required: true },
    userid: { type: String, required: true },
    commentbody: { type: String, required: true },
    usercommented: { type: String },
  },
  { timestamps: { createdAt: "commentedon", updatedAt: false } }
);

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);