export const isWithinNextWeek = (date) => {
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  return new Date(date) <= nextWeek
}

export const isOverdue = (date) => {
  return new Date(date) < new Date()
}
