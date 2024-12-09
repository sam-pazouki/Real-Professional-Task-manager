export const isWithinNextWeek = (date) => {
  if (!date) return false
  
  const today = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(today.getDate() + 7)
  
  const checkDate = new Date(date)
  return checkDate >= today && checkDate <= nextWeek
}

export const isOverdue = (date) => {
  if (!date) return false
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  
  return checkDate < today
}
