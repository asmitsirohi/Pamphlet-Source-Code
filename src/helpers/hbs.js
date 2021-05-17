module.exports = {
  splitSkills: function (skills) {
    skills = skills.split(",");

    return skills;
  },

  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },

  ifNotCond: function (arg1, arg2, options) {
    if (arg1 != arg2) {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  ifCond: function (arg1, arg2, options) {
    if (arg1 == arg2) {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  indexIncrement: function(index, value) {
    return index+value;
  }
};
