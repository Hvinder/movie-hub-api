const mongoose = require("mongoose");
// const Actor = require("./actor");
// const Category = require("./category");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  long_description: { type: String, required: true },
  actors: [{ type: Schema.Types.ObjectId, ref: "Actor" }],
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
}).set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Movie", MovieSchema);
