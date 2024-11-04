const host = 'http://localhost:1452'
const target_category = '/api/category/'
const target_subcategory = '/api/subcategory/'
const target_products = '/api/products/'

function buildPath(target) {
    let url = host
    return url.concat('/', target)
}

async function getCategory(id) {
    let url = host
    const remote = url.concat('', `${target_category}${id}`)
    const response = await fetch(remote)
    return response.json();
}

async function getProduct(id) {
    let url = host
    const response = await fetch(url.concat('', `${target_products}${id}`))
    return response.json();
}

async function getAllProducts() {
    let url = host
    const response = await fetch(url.concat('', `${target_products}`))
    return response.json();
}

export {buildPath, getCategory, getProduct, getAllProducts};
