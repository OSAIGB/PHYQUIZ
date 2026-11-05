import { EXAM_QUESTIONS } from '../data/questions';
import { ExamInfraction, ExamResult, ExamSection, Recommendation } from '../types/exam';

export function calculateExamResults(
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | null>,
  timeSpentPerQuestion: Record<number, number>,
  timedOutQuestions: number[],
  infractions: ExamInfraction[],
  startTime: number,
  endTime: number
): ExamResult {
  let score = 0;
  const sectionScores: Record<ExamSection, { score: number; total: number; percentage: number }> = {
    JUPEB: { score: 0, total: 10, percentage: 0 },
    UNIBEN: { score: 0, total: 5, percentage: 0 },
    JAMB: { score: 0, total: 5, percentage: 0 },
  };

  const topicBreakdown: Record<string, { correct: number; total: number }> = {};
  const missedQuestionIds: number[] = [];

  EXAM_QUESTIONS.forEach((q) => {
    const studentChoice = answers[q.id];
    const isCorrect = studentChoice === q.correctAnswer;

    if (!topicBreakdown[q.topic]) {
      topicBreakdown[q.topic] = { correct: 0, total: 0 };
    }
    topicBreakdown[q.topic].total += 1;

    if (isCorrect) {
      score += 1;
      sectionScores[q.section].score += 1;
      topicBreakdown[q.topic].correct += 1;
    } else {
      missedQuestionIds.push(q.id);
    }
  });

  // Calculate percentages
  (['JUPEB', 'UNIBEN', 'JAMB'] as ExamSection[]).forEach((sec) => {
    sectionScores[sec].percentage = Math.round((sectionScores[sec].score / sectionScores[sec].total) * 100);
  });

  const totalQuestions = EXAM_QUESTIONS.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  let grade = 'F · Needs Intensive Revision';
  if (percentage >= 80) grade = 'A · Distinction';
  else if (percentage >= 70) grade = 'B · Merit';
  else if (percentage >= 60) grade = 'C · Credit';
  else if (percentage >= 50) grade = 'D · Pass';

  const totalDurationSeconds = Math.round((endTime - startTime) / 1000);

  const recommendations = generateRecommendations(missedQuestionIds, timedOutQuestions);

  return {
    startTime,
    endTime,
    totalDurationSeconds,
    answers,
    timeSpentPerQuestion,
    timedOutQuestions,
    score,
    totalQuestions,
    percentage,
    grade,
    infractions,
    sectionScores,
    topicBreakdown,
    recommendations,
  };
}

function generateRecommendations(missedIds: number[], timedOutIds: number[]): Recommendation[] {
  const recs: Recommendation[] = [];

  // Group 1: Standard Oblique Projectile Formulas (Q1, Q2, Q3, Q10, Q20)
  const obliqueMissed = [1, 2, 3, 10, 20].filter((id) => missedIds.includes(id));
  if (obliqueMissed.length > 0) {
    recs.push({
      title: 'Oblique Projectile Formulas & Trigonometric Ratios',
      status: obliqueMissed.length >= 2 ? 'critical' : 'moderate',
      advice: 'Review standard oblique trajectory formulas: Maximum height H = (u sin θ)² / (2g), Time of flight T = (2u sin θ) / g, and Horizontal Range R = (u² sin 2θ) / g. Also memorize the geometric ratio H/R = (tan θ) / 4.',
      keyFormula: 'H = \\frac{(u \\sin\\theta)^2}{2g}, \\quad T = \\frac{2u \\sin\\theta}{g}, \\quad R = \\frac{u^2 \\sin 2\\theta}{g}',
      relatedQuestions: obliqueMissed,
    });
  } else {
    recs.push({
      title: 'Oblique Projectile Trajectories',
      status: 'mastered',
      advice: 'Exceptional mastery of oblique kinematics! You accurately calculated peak heights, flight durations, and horizontal ranges.',
      keyFormula: 'H = \\frac{(u \\sin\\theta)^2}{2g}, \\quad R = \\frac{u^2 \\sin 2\\theta}{g}',
      relatedQuestions: [1, 2, 3, 10, 20],
    });
  }

  // Group 2: Horizontal Projections from Heights / Cliffs (Q4, Q5, Q6, Q7)
  const cliffMissed = [4, 5, 6, 7].filter((id) => missedIds.includes(id));
  if (cliffMissed.length > 0) {
    recs.push({
      title: 'Horizontal Launches & Cliff Projections',
      status: cliffMissed.length >= 2 ? 'critical' : 'moderate',
      advice: 'In horizontal projections, the initial vertical velocity is always zero (u_y = 0). Fall time depends strictly on vertical height t = √(2h / g), regardless of mass or horizontal speed. Horizontal distance is simply x = v_x × t.',
      keyFormula: 't = \\sqrt{\\frac{2h}{g}}, \\quad x = v_x \\cdot t',
      relatedQuestions: cliffMissed,
    });
  } else {
    recs.push({
      title: 'Horizontal Launch & Free-Fall Independence',
      status: 'mastered',
      advice: 'Perfect comprehension of horizontal projectile dynamics! You correctly decoupled horizontal velocity from vertical gravitational acceleration.',
      keyFormula: 't = \\sqrt{\\frac{2h}{g}}, \\quad x = v_x \\cdot t',
      relatedQuestions: [4, 5, 6, 7],
    });
  }

  // Group 3: Velocity Vectors & Apex Dynamics (Q8, Q9, Q11)
  const vectorMissed = [8, 9, 11].filter((id) => missedIds.includes(id));
  if (vectorMissed.length > 0) {
    recs.push({
      title: 'Velocity Vector Resolution & Peak Dynamics',
      status: vectorMissed.length >= 2 ? 'critical' : 'moderate',
      advice: 'Remember that horizontal velocity v_x = u cos θ remains completely constant because no net horizontal force acts. At maximum height, only v_y = 0, so speed at the peak is u cos θ. For velocity at any time t, resolve v = √(v_x² + v_y²).',
      keyFormula: 'v_x = u \\cos\\theta, \\quad v_y = u \\sin\\theta - gt, \\quad v = \\sqrt{v_x^2 + v_y^2}',
      relatedQuestions: vectorMissed,
    });
  }

  // Group 4: Complementary Angles & Optimum Range (Q12, Q13, Q19)
  const compMissed = [12, 13, 19].filter((id) => missedIds.includes(id));
  if (compMissed.length > 0) {
    recs.push({
      title: 'Complementary Launch Angles & Range Invariance',
      status: compMissed.length >= 2 ? 'critical' : 'moderate',
      advice: 'Two launch angles produce the exact same horizontal range on level ground if they are complementary: θ₁ + θ₂ = 90°. Maximum range strictly occurs at 45° where sin 2θ = 1.',
      keyFormula: 'R(\\theta) = R(90^\\circ - \\theta), \\quad \\theta_{opt} = 45^\\circ',
      relatedQuestions: compMissed,
    });
  }

  // Group 5: Conservation of Energy & Gravitational Acceleration (Q14, Q15, Q16, Q17, Q18)
  const freeFallMissed = [14, 15, 16, 17, 18].filter((id) => missedIds.includes(id));
  if (freeFallMissed.length > 0) {
    recs.push({
      title: 'Work-Energy Equivalence & 1D Free Fall',
      status: freeFallMissed.length >= 2 ? 'critical' : 'moderate',
      advice: 'Apply conservation of mechanical energy: initial potential energy mgh converts directly to kinetic energy ½mv² just before impact (KE = mgh). In vacuum, acceleration g is universal regardless of mass.',
      keyFormula: 'E_k = mgh, \\quad v = \\sqrt{2gh}, \\quad v^2 = u^2 + 2as',
      relatedQuestions: freeFallMissed,
    });
  }

  // Pacing / Timer analysis
  if (timedOutIds.length > 0) {
    recs.push({
      title: '40-Second Time Budget Management',
      status: timedOutIds.length >= 2 ? 'critical' : 'moderate',
      advice: `You encountered ${timedOutIds.length} question timeout(s). To beat the 40-second clock, write down the formula template immediately, pre-compute trigonometric values with the on-screen calculator, and substitute g (either 9.8 or 10 as specified).`,
      keyFormula: '\\text{Target Pace} \\le 25\\text{s per question to review in remaining } 15\\text{s}',
      relatedQuestions: timedOutIds,
    });
  }

  return recs;
}
