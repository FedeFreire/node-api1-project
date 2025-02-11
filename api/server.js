const express = require("express");
const User = require("./users/model");

const server = express();

server.use(express.json());

server.get("/hello-world", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

server.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: `Failed to get users ${err.message}` });
  }
});

server.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({
      message: "The user information could not be retrieved",
    });
  }
});

server.post("/api/users", async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name || !bio) {
      res.status(400).json({
        message: "Please provide name and bio for the user",
      });
    } else {
      const createdUser = await User.insert({ name, bio });
      res.status(201).json({
        bio: createdUser.bio,
        id: createdUser.id,
        name: createdUser.name,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "There was an error while saving the user to the database",
    });
  }
});

server.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;
    if (!name || !bio) {
      res.status(400).json({
        message: "Please provide name and bio for the user",
      });
    } else {
      const updatedUser = await User.update(id, { name, bio });
      if (!updatedUser) {
        res.status(404).json({
          message: "The user with the specified ID does not exist",
        });
      } else {
        res.status(200).json({
          bio: updatedUser.bio,
          id: updatedUser.id,
          name: updatedUser.name,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "The user information could not be modified",
    });
  }
});

server.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.remove(id);
    if (!deletedUser) {
      res.status(404).json({
        message: "The user with the specified ID does not exist",
      });
    } else {
      res.status(200).json({
        //message: 'User deleted successfully',
        bio: deletedUser.bio,
        id: deletedUser.id,
        name: deletedUser.name,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "The user could not be removed",
    });
  }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
