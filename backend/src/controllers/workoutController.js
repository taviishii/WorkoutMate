const Workout = require("../models/workoutModel");

const LIMIT = 3;

module.exports = {
  get_all_user_workouts: async (req, res) => {
    try {
      const { search, p } = req.query;
      const page = Number(p) || 1;
      const userId = req.user._id;

      const query = {};
      if (search) {
        query.title = new RegExp(`^${search.toLowerCase()}`);
      }
      query.user_id = userId;

      const total = await Workout.countDocuments(query);
      const workoutsChunk = await Workout.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * LIMIT)
        .limit(LIMIT);

      const allWorkouts = await Workout.find({ user_id: userId }).select("muscle_group");
      const allUserWorkoutsMuscleGroups = allWorkouts.map(w => w.muscle_group);

      res.status(200).json({
        workoutsChunk,
        allUserWorkoutsMuscleGroups,
        total,
        limit: LIMIT,
        noWorkoutsByQuery: total === 0 && search ? "No workouts found with that title" : "",
      });
    } catch (error) {
      console.error("Error in get_all_user_workouts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  add_workout: async (req, res) => {
    try {
      const { title, muscle_group, reps, load } = req.body;

      // Validation
      if (!title || !muscle_group || !reps || !load) {
        return res.status(400).json({ error: "Please fill out the empty fields" });
      }
      if (!/^[a-zA-Z\s]*$/.test(title)) {
        return res.status(400).json({ error: "Title may contain only letters" });
      }
      if (title.length > 30) {
        return res.status(400).json({ error: "Too long title - max 30 characters" });
      }
      if (Number(load) > 9999) {
        return res.status(400).json({ error: "Load value too large" });
      }
      if (Number(reps) > 9999) {
        return res.status(400).json({ error: "Reps value too large" });
      }

      const workout = await Workout.create({
        title,
        muscle_group,
        reps: Number(reps),
        load: Number(load),
        user_id: req.user._id,
      });

      res.status(200).json(workout);
    } catch (error) {
      console.error("Error in add_workout:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  update_workout: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, muscle_group, reps, load } = req.body;

      const workout = await Workout.findOneAndUpdate(
        { _id: id, user_id: req.user._id },
        { title, muscle_group, reps: Number(reps), load: Number(load) },
        { new: true, runValidators: true }
      );

      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }

      res.status(200).json(workout);
    } catch (error) {
      console.error("Error in update_workout:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  delete_workout: async (req, res) => {
    try {
      const { id } = req.params;
      const workout = await Workout.findOneAndDelete({
        _id: id,
        user_id: req.user._id,
      });

      if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
      }

      res.status(200).json({ workout, id });
    } catch (error) {
      console.error("Error in delete_workout:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  delete_all_user_workouts: async (req, res) => {
    try {
      await Workout.deleteMany({ user_id: req.user._id });
      res.status(200).json({ success: "all workouts deleted" });
    } catch (error) {
      console.error("Error in delete_all_user_workouts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
