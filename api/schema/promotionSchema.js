import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Created dynamically Schema can be all types and can expand
// PromotionName,Type,StartDate,EndDate,UserGroupName
export const PromotionSchema = new Schema(
  {
    PromotionName: {
      type: Schema.Types.Mixed,
      required: true
    },
    Type: {
      type: Schema.Types.Mixed,
      enum: ["Basic", "Common", "Epic"],
      required: true
    },
    StartDate: {
      type: Schema.Types.Mixed,
      default: Date.now()
    },
    EndDate: {
      type: Schema.Types.Mixed,
      default: Date.now()
    },
    UserGroupName: {
      type: Schema.Types.Mixed
    }
  },
  { strict: false }
);
