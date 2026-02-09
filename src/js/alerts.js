function getDeadlineAlerts(tasks) {
  const today = new Date().toISOString().split("T")[0];

  return tasks
    .filter(t => t.status !== "Completed")
    .map(task => {
      const diff =
        (new Date(task.deadline) - new Date(today)) /
        (1000 * 60 * 60 * 24);

      if (diff < 0) {
        return { ...task, level: "overdue" };
      }
      if (diff === 0) {
        return { ...task, level: "today" };
      }
      if (diff === 1) {
        return { ...task, level: "tomorrow" };
      }
      return null;
    })
    .filter(Boolean);
}
