const formatCurrency = currency => {
  const formated = currency.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  })

  return formated
}


export{
  formatCurrency
}