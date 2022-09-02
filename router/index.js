const express = require("express");
const Movie = require("../model/movie");
const Actor = require("../model/actor");
const Category = require("../model/category");

const router = express.Router();

router.use((req, res, next) => {
  console.log(`${req.method} request received`);
  next();
});

router.get("/movies", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const search = req.query.search || "";
  const query = new RegExp(search, "i");

  Movie.find({ name: query })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate({ path: "actors", select: "name" })
    .populate({ path: "categories", select: "name" })
    .exec((err, movies) => {
      if (err) throw err;
      console.log(movies);
      res.send(movies);
    });
});

router.get("/movie", (req, res) => {
  const id = req.query.id;
  Movie.findOne({ _id: id })
    .populate({ path: "actors", select: "name" })
    .populate({ path: "categories", select: "name" })
    .exec((err, movie) => {
      if (err) throw err;
      console.log(movie);
      res.send(movie);
    });
});

// Add jobs to Database for testing
router.get("/add-movie", async (req, res) => {
  const name = "Memento";
  const description =
    "A man with short-term memory loss attempts to track down his wife's murderer.";
  const long_description = `Memento chronicles two separate stories of Leonard, an ex-insurance investigator who can no longer build new memories, as he attempts to find the murderer of his wife, which is the last thing he remembers. One story line moves forward in time while the other tells the story backwards revealing more each time.`;

  const actorNames = ["Guy Pearce", "Carrie-Anne Moss", "Joe Pantoliano"];
  const categoryNames = ["Mystery", "Thriller"];
  const actors = await Promise.all(
    actorNames.map(async (actorName) => {
      const data = await Actor.findOne({ name: actorName }).exec();
      if (data && data._id) {
        return data;
      }
      return await new Actor({ name: actorName }).save();
    })
  );
  const categories = await Promise.all(
    categoryNames.map(async (categoryName) => {
      const data = await Category.findOne({ name: categoryName }).exec();
      if (data && data._id) {
        return data;
      }
      return await new Category({ name: categoryName }).save();
    })
  );
  const data = new Movie({
    name,
    description,
    long_description,
    actors,
    categories,
  });
  data.save().then((err) => {
    if (err) console.log(err);
    console.log("saved");
    res.send({ message: "success" });
  });
});

// var query = Model.find().sort('mykey', 1).skip(2).limit(5)
// query.exec(callback);

// app.get('/api/posts', (req, res) => {
//     const pageCount = Math.ceil(posts.length / 10);
//     let page = parseInt(req.query.p);
//     if (!page) { page = 1;}
//     if (page > pageCount) {
//       page = pageCount
//     }
//     res.json({
//       "page": page,
//       "pageCount": pageCount,
//       "posts": posts.slice(page * 10 - 10, page * 10)
//     });
//   });

module.exports = router;
