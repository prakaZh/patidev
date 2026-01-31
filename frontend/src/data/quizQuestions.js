// 15 Questions for Pati Devta Quiz organized by categories (categories hidden from users)
export const QUIZ_QUESTIONS = [
  // Category 1: Personality and Psychological Stability
  {
    id: 1,
    question: "Does he generally remain calm and handle stressful household situations with poise, calm and grace?",
    category: "personality_stability",
    categoryName: "Personality and Psychological Stability"
  },
  {
    id: 2,
    question: "Does he demonstrate a high level of trust and altruism in his daily interactions with you?",
    category: "personality_stability",
    categoryName: "Personality and Psychological Stability"
  },
  {
    id: 3,
    question: "Is he free from tendencies toward frequent emotional distress, chronic anxiety, or hostility?",
    category: "personality_stability",
    categoryName: "Personality and Psychological Stability"
  },
  
  // Category 2: Cognitive Empathy and Partner Perspective-Taking
  {
    id: 4,
    question: "During conflicts or meaningful discussions, does he actively attempt to see the situation from your vantage point?",
    category: "cognitive_empathy",
    categoryName: "Cognitive Empathy and Partner Perspective-Taking"
  },
  {
    id: 5,
    question: "Is he consistently accurate at predicting your feelings or reactions to life events?",
    category: "cognitive_empathy",
    categoryName: "Cognitive Empathy and Partner Perspective-Taking"
  },
  {
    id: 6,
    question: "Does he show genuine empathic concern for your feelings when you are in distress?",
    category: "cognitive_empathy",
    categoryName: "Cognitive Empathy and Partner Perspective-Taking"
  },
  
  // Category 3: Conflict Management and Relational Influence
  {
    id: 7,
    question: "Is he willing to accept influence by valuing your opinions and sharing power during decision-making?",
    category: "conflict_management",
    categoryName: "Conflict Management and Relational Influence"
  },
  {
    id: 8,
    question: "Does he approach difficult topics gently, avoiding the use of blame, criticism, or harsh startups?",
    category: "conflict_management",
    categoryName: "Conflict Management and Relational Influence"
  },
  {
    id: 9,
    question: "When a disagreement occurs, is he effective at making small repair attempts, such as using humor or an apology to reconnect?",
    category: "conflict_management",
    categoryName: "Conflict Management and Relational Influence"
  },
  
  // Category 4: Proactive Domestic Contribution and Shared Labor
  {
    id: 10,
    question: "Does he take full ownership of specific household tasks without waiting for you to tell him what, when, or how to do it?",
    category: "domestic_contribution",
    categoryName: "Proactive Domestic Contribution and Shared Labor"
  },
  {
    id: 11,
    question: "Does he proactively share the mental load by noticing family needs and researching options independently?",
    category: "domestic_contribution",
    categoryName: "Proactive Domestic Contribution and Shared Labor"
  },
  {
    id: 12,
    question: "Is your division of labor based on a flexible, egalitarian team approach rather than rigid gender roles?",
    category: "domestic_contribution",
    categoryName: "Proactive Domestic Contribution and Shared Labor"
  },
  
  // Category 5: Attachment Security and Relational Investment
  {
    id: 13,
    question: "When you share good news, does he respond with enthusiastic, wholehearted engagement?",
    category: "attachment_security",
    categoryName: "Attachment Security and Relational Investment"
  },
  {
    id: 14,
    question: "Does he regularly make small bids for connection to build up the relationship's emotional bond?",
    category: "attachment_security",
    categoryName: "Attachment Security and Relational Investment"
  },
  {
    id: 15,
    question: "Does he provide a safe haven where you feel comfortable being both emotionally intimate and autonomous?",
    category: "attachment_security",
    categoryName: "Attachment Security and Relational Investment"
  }
];

// Category definitions for scoring
export const CATEGORIES = {
  personality_stability: {
    name: "Personality and Psychological Stability",
    questions: [1, 2, 3]
  },
  cognitive_empathy: {
    name: "Cognitive Empathy and Partner Perspective-Taking",
    questions: [4, 5, 6]
  },
  conflict_management: {
    name: "Conflict Management and Relational Influence",
    questions: [7, 8, 9]
  },
  domestic_contribution: {
    name: "Proactive Domestic Contribution and Shared Labor",
    questions: [10, 11, 12]
  },
  attachment_security: {
    name: "Attachment Security and Relational Investment",
    questions: [13, 14, 15]
  }
};
