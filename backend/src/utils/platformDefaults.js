function buildDefaultPlatform(studentId) {
  return {
    student: studentId,
    leetcode: {
      solved: 0,
      easy: 0,
      medium: 0,
      hard: 0,
      streak: 0,
    },
    skillrack: {
      score: 0,
      problems: 0,
      badge: "Bronze",
    },
    codechef: {
      rating: 0,
      stars: 0,
    },
    codingProfiles: {
      leetcodeUsername: "",
      skillrackUrl: "",
    },
  };
}

module.exports = { buildDefaultPlatform };
