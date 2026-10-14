// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function temPrecoValido(produto) {
  if (!produto || produto.price === null || produto.price === undefined) {
    return false
  }

  const valor = Number(produto.price)
  return String(produto.price).trim() !== '' && Number.isFinite(valor)
}

export function calcularTotal(carrinho) {
  return carrinho
    .filter(temPrecoValido)
    .reduce((total, produto) => total + Number(produto.price), 0)
}

export function removerUmaUnidade(carrinho, produtoId) {
  let removido = false

  return carrinho.filter((produto) => {
    if (!removido && produto.id === produtoId) {
      removido = true
      return false
    }

    return true
  })
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.filter(temPrecoValido).forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}

export function getFreteGratisInfo(valorTotal) {
  const valor = Number(valorTotal ?? 0)
  const meta = 200
  const restante = Number(Math.max(meta - valor, 0).toFixed(2))

  return {
    meta,
    valor,
    restante,
    liberado: valor >= meta,
  }
}

export function podeAdicionarAoCarrinho(produto) {
  if (!produto) {
    return false
  }

  const precoValido = temPrecoValido(produto)
  const temEstoque = Number(produto.estoque ?? 0) > 0

  return precoValido && temEstoque
}
