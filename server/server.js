const exp = require("express");
const app = exp();
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");
const userApp = require("./APIs/userApi");
const authorApp = require("./APIs/authorApi");
const adminApp = require("./APIs/adminApi");
const UserAuthor = require("./models/userAuthorModel"); // Import user model

app.use(cors());

const port = process.env.PORT || 4000;

mongoose.connect(process.env.DBURL)
  .then(() => {
    app.listen(port, () => console.log(`Server listening on port ${port}..`));
    console.log("DB connection success");
  })
  .catch(err => console.log("Error in DB connection ", err));


app.use(exp.json());

app.use('/user-api', userApp);
app.use("/author-api", authorApp);
app.use('/admin-api', adminApp);

app.post("/check-blocked", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserAuthor.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found", isBlocked: false });
    }

    res.status(200).send({ isBlocked: user.isActive === false });
  } catch (error) {
    res.status(500).send({ message: "Server error", isBlocked: false });
  }
});


app.use((err, req, res, next) => {
  console.log("Error in express error handler:", err);
  res.status(500).send({ message: err.message });
});
