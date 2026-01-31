// 15 Questions for Pati Devta Quiz - Simplified language
export const QUIZ_QUESTIONS = [
  // Category 1: Personality and Psychological Stability
  {
    id: 1,
    question: "Does he stay calm when things get stressful at home?",
    category: "personality_stability",
    categoryName: "Personality and Psychological Stability"
  },
  {
    id: 2,
    question: "Is he generally kind and helpful to you every day?",
    category: "personality_stability",
    categoryName: "Personality and Psychological Stability"
  },
  {
    id: 3,
    question: "Does he avoid getting angry, anxious or upset too often?",
    category: "personality_stability",
    categoryName: "Personality and Psychological Stability"
  },
  
  // Category 2: Cognitive Empathy and Partner Perspective-Taking
  {
    id: 4,
    question: "When you argue, does he try to understand your point of view?",
    category: "cognitive_empathy",
    categoryName: "Cognitive Empathy and Partner Perspective-Taking"
  },
  {
    id: 5,
    question: "Can he usually tell how you're feeling without you saying it?",
    category: "cognitive_empathy",
    categoryName: "Cognitive Empathy and Partner Perspective-Taking"
  },
  {
    id: 6,
    question: "Does he truly care when you're sad or upset?",
    category: "cognitive_empathy",
    categoryName: "Cognitive Empathy and Partner Perspective-Taking"
  },
  
  // Category 3: Conflict Management and Relational Influence
  {
    id: 7,
    question: "Does he value your opinions when making decisions together?",
    category: "conflict_management",
    categoryName: "Conflict Management and Relational Influence"
  },
  {
    id: 8,
    question: "Does he talk nicely even when discussing difficult topics?",
    category: "conflict_management",
    categoryName: "Conflict Management and Relational Influence"
  },
  {
    id: 9,
    question: "After a fight, does he try to make up with a joke or sorry?",
    category: "conflict_management",
    categoryName: "Conflict Management and Relational Influence"
  },
  
  // Category 4: Proactive Domestic Contribution and Shared Labor
  {
    id: 10,
    question: "Does he do household chores without you asking?",
    category: "domestic_contribution",
    categoryName: "Proactive Domestic Contribution and Shared Labor"
  },
  {
    id: 11,
    question: "Does he notice what the family needs and take action on his own?",
    category: "domestic_contribution",
    categoryName: "Proactive Domestic Contribution and Shared Labor"
  },
  {
    id: 12,
    question: "Do you both share housework equally as a team?",
    category: "domestic_contribution",
    categoryName: "Proactive Domestic Contribution and Shared Labor"
  },
  
  // Category 5: Attachment Security and Relational Investment
  {
    id: 13,
    question: "When you share good news, does he get excited with you?",
    category: "attachment_security",
    categoryName: "Attachment Security and Relational Investment"
  },
  {
    id: 14,
    question: "Does he often do small things to show he loves you?",
    category: "attachment_security",
    categoryName: "Attachment Security and Relational Investment"
  },
  {
    id: 15,
    question: "Do you feel safe to share your feelings and be yourself with him?",
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
