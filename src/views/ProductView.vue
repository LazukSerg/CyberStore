<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getProduct, buildPath, getAllProducts } from '../api.js'
import screensize from '../resources/images/product/info/specs/screensize.svg'
import cpu from '../resources/images/product/info/specs/cpu.svg'
import cores from '../resources/images/product/info/specs/cores.svg'
import battery from '../resources/images/product/info/specs/battery.svg'
import delivery from '../resources/images/product/info/misc/delivery.svg'
import stock from '../resources/images/product/info/misc/stock.svg'
import guarantee from '../resources/images/product/info/misc/guarantee.svg'

const route = useRoute()

const loading = ref(false)
const post_product = ref(null)
const error = ref(null)

const post_another = ref(null)

const mapIconsSpec = new Map([
    ["Диагональ", screensize],
    ["Разрешение", screensize],
    ["Процессор", cpu],
    ["Аккумулятор", battery],
    ["Питание", battery],
    ["Кол-во ядер", cores]
]);

const getIcon = (elem) => {
    let res = mapIconsSpec.get(elem.characteristic)
    console.log(`${elem.characteristic} : ${res}`)
    return res == undefined ? '' : res
}

watch(() => route.params.id, fetchData, { immediate: true })

async function fetchData(id) {
    error.value = post_product.value = post_another.value = null
    loading.value = true
  
    try {
        post_product.value = await getProduct(id)  
        let allProducts = await getAllProducts()
        const shuffledProducts = allProducts.sort(() => 0.5 - Math.random());
        post_another.value = shuffledProducts.slice(0, 4);
    } catch (err) {
        error.value = err.toString()
    } finally {
        loading.value = false
    }
}
</script>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
          'addProduct',
        ]),
        addProductToCart(product) {
            this.addProduct(product);
        },
    },
};
</script>

<template>
    <div style="background: #FAFAFA;">
        <div v-if="post_product" class="container container-flex-column">
            <div class="product-intro container-flex-row">
                <div class="product-images">
                    <img :src="buildPath(post_product.images[0])">
                </div>
                <div class="product-info container-flex-column">
                    <div class="product-title">{{post_product.name}}</div>
                    <div class="product-price container-flex-row"><p>${{post_product.discount_price ? post_product.discount_price : post_product.price}}</p><s>{{post_product.discount_price ? `$${post_product.price}` : ''}}</s></div>
                    <div class="product-specs container-flex-row">
                        <div v-for="characteristic in post_product.characteristics" class="product-spec container-flex-row">
                            <div class="product-spec-image" ><img :src="getIcon(characteristic)"></div>
                            <div class="product-spec-text" >
                                <h3>{{characteristic.characteristic}}</h3>
                                <p>{{characteristic.value}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="product-actions container-flex-row">
                        <button class="action-wishlist">Add to Wishlist</button>
                        <button class="action-cart" @click.native="addProductToCart(post_product)">Add to Cart</button>
                    </div>
                    <div class="product-misc container-flex-row">
                        <div class="misc-delivery container-flex-row">
                            <div class="misc-image" ><img :src="delivery"></div>
                            <div class="misc-text container-flex-column" >
                                <h3>Free Delivery</h3>
                                <p>1-2 days</p>
                            </div>
                        </div>
                        <div class="misc-in-stock container-flex-row">
                            <div class="misc-image" ><img :src="stock"></div>
                            <div class="misc-text container-flex-column" >
                                <h3>In Stock</h3>
                                <p>{{post_product.is_available ? 'Today' : 'None'}}</p>
                            </div>
                        </div>
                        <div class="misc-guaranteed container-flex-row">
                            <div class="misc-image" ><img :src="guarantee"></div>
                            <div class="misc-text container-flex-column" >
                                <h3>Guaranteed</h3>
                                <p>{{ post_product.guarantee + " months"}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-details container-flex-column">
                <h2>Details</h2>
                <ul v-for="characteristic in post_product.characteristics" >
                    <li><div class="details-flex-row container-flex-row"><p>{{characteristic.characteristic}}</p><p>{{characteristic.value}}</p></div></li>
                </ul>
            </div>
            <div class="product-mark container-flex-column">
                <div class="product-mark-box">
                    <h3>{{post_product.rating}}</h3>
                    <p>{{`of ${post_product.count_review} reviews`}}</p>
                    <span :class="post_product.rating >= 1 ? 'fa fa-star checked' : 'fa fa-star'"></span>
                    <span :class="post_product.rating >= 2 ? 'fa fa-star checked' : 'fa fa-star'"></span>
                    <span :class="post_product.rating >= 3 ? 'fa fa-star checked' : 'fa fa-star'"></span>
                    <span :class="post_product.rating >= 4 ? 'fa fa-star checked' : 'fa fa-star'"></span>
                    <span :class="post_product.rating >= 5 ? 'fa fa-star checked' : 'fa fa-star'"></span>
                </div>
            </div>
        </div>
        <h3 class="related-products">Related products</h3>
        <div v-if="post_another" class="related-product-content container-flex-row">
            <div v-for="product in post_another" class="product-card container-flex-column">
                <router-link :to="`/api/product/${product.id}`">
                    <div class="product-card-like">
                        <img src="../resources/images/products/fav.svg">
                    </div>
                    <div class="product-card-image">
                        <img :src="buildPath(product.images[0])" style="width: 70%;">
                    </div>
                    <p class="product-card-title">{{ product.name }}</p>
                    <div class="product-card-price">${{product.discount_price ? product.discount_price : product.price}}</div>
                </router-link>
                <button class="product-card-add" @click.native="addProductToCart(product)">Buy Now</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.checked {
  color: orange;
}
.product-mark {
    height: 100%;
    width: 80%;
    align-self: center;
    background: #FFFFFF;
    padding-top: 1%;
    padding-bottom: 1%;
    align-content: center;
    align-items: center;
    margin-bottom: 10%;
}
.product-mark-box {
    height: fit-content;
    width: fit-content;
    background: #FAFAFA;
    padding-left: 4%;
    padding-right: 4%;
    padding-top: 4%;
    padding-bottom: 4%;
    align-self: center;
    border-radius: 5%;
}
.product-mark-box > h3 {
    font-family: "ABeeZee", sans-serif;
    font-size: 56px;
    font-style: italic;
    font-weight: 400;
    line-height: 56px;
    text-align: center;
    margin-bottom: 16px;
}
.product-mark-box > p {
    font-family: "ABeeZee", sans-serif;
    font-size: 15px;
    font-style: italic;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
    margin-bottom: 8px;
}
.product-mark-box > span {
    align-self: center;
}

.product-details {
    height: fit-content;
    width: 80%;
    align-self: center;
    margin-top: 64px;
    margin-bottom: 64px;
    background: #FFFFFF;
    padding-left: 4%;
    padding-right: 4%;
    padding-top: 2%;
    padding-bottom: 2%;
}
.product-details > h2 {
    margin-bottom: 64px;
    font-family: "ABeeZee", sans-serif;
    font-size: 24px;
    font-style: italic;
    font-weight: 400;
    line-height: 32px;
    text-align: left;
}
.details-flex-row {
    height: fit-content;
    width: 100%;
    align-self: center;
}
.details-flex-row > p {
    font-family: "Abel", sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    text-align: left;
}

.product-intro {
    height: fit-content;
    width: 100%;
    align-self: center;
    align-items: center;
    align-content: center;
    background: #FFFFFF;
}
.product-images {
    width: 40%;
}
.product-info {
    height: fit-content;
    width: 60%;
    align-self: center;
    padding-right: 10%;
}
.product-title {
    font-family: "ABeeZee", sans-serif;
    font-size: 40px;
    font-style: italic;
    font-weight: 400;
    line-height: 40px;
    text-align: left;
}
.product-price {
    width: 100%;
}
.product-price > p {
    font-family: "ABeeZee", sans-serif;
    font-size: 32px;
    font-style: italic;
    font-weight: 400;
    line-height: 48px;
    letter-spacing: 0.03em;
    text-align: left;
}
.product-price > s {
    font-family: "Abel", sans-serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 32px;
    letter-spacing: 0.03em;
    text-align: left;
}

.product-specs {
    height: fit-content;
    width: fit-content;
    align-items: center;
    align-content: center;
}
.product-spec {
    height: fit-content;
    width: fit-content;
    padding: 16px 0px 0px 0px;
    gap: 8px;
    opacity: 0px;
    background: #F4F4F4;
    margin-bottom: 8px;
    margin-top: 8px;
    border-radius: 5%;
    align-items: center;
    align-content: center;
    padding-left: 2%;
    padding-right: 3%;
    padding-bottom: 2%;
    margin-right: 1%;
}
.product-spec-text > h3 {
    font-family: "Abel", sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    color: #4E4E4E;
    opacity: 50%;
}
.product-spec-text > p {
    font-family: "ABeeZee", sans-serif;
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    color: #4E4E4E;
}
.product-spec-image {
    width: fit-content;
    height: 100%;
    padding-left: 0;
}
.product-spec-text {
    width: fit-content;
    height: 100%;
    padding-left: 0;
    padding-bottom: 2%;
}

.product-actions {
    width: 100%;
    height: 56px;
    align-items: center;
    align-content: center;
    font-family: "ABeeZee", sans-serif;
    font-size: 16px;
    font-style: italic;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    margin-top: 32px;
    margin-bottom: 32px;
}
.action-wishlist {
    width: 48%;
    height: 100%;
    gap: 8px;
    border-radius: 5%;
    border: 1px 0px 0px 0px;
    opacity: 0px;
    border: 1px solid #000000;
    background: #FFFFFF;
    text-align: center;
    margin-right: 2%;
}
.action-cart {
    width: 48%;
    height: 100%;
    gap: 8px;
    border-radius: 5%;
    border: 1px 0px 0px 0px;
    opacity: 0px;
    border: 1px solid #000000;
    background: #000000;
    color: #FFFFFF;
    text-align: center;
    margin-left: 2%;
}

.product-misc {
    width: 100%;
    height: fit-content;
    align-items: center;
    align-content: center;
    margin-top: 16px;
}
.product-misc > div {
    width: fit-content;
    height: 100%;
    background: #F6F6F6;
    align-items: center;
    align-content: center;
    padding-left: 4%;
    padding-right: 4%;
    padding-top: 3%;
    padding-bottom: 3%;
    margin-top: 1rem;
}
.misc-text > h3 {
    font-family: "ABeeZee", sans-serif;
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
    line-height: 24px;
    text-align: left;
    color: #717171;
}
.misc-text > p {
    font-family: "ABeeZee", sans-serif;
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
    line-height: 24px;
    text-align: left;
    color: #000000;
}
.misc-image {
    width: fit-content;
    height: 100%;
    padding-left: 0;
    width: 30%;
}
.misc-text {
    width: 70%;
    height: 100%;
    padding-right: 0;
    padding-bottom: 2%;
}

.related-products {
    font-family: 'ABeeZee';
    font-style: italic;
    font-size: 24px;
    margin-left: 10%
}

.related-product-content {
    padding-left: 10%;
    padding-right: 10%;
    margin-bottom: 10%;
}
.product-card {
    background: #F6F6F6;
    width: 266.33px;
    height: 432px;
    padding: 24px 16px 24px 16px;
    gap: 16px;
    border-radius: 9px 0px 0px 0px;
    opacity: 0px;
    font-family: "ABeeZee", sans-serif;
    font-size: 16px;
    font-style: italic;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    align-content: center;
    align-items: center;
    margin-top: 16px;
    margin-bottom: 16px;
}
.product-card-like {
    padding-right: 0;
    width: 8%;
}
.product-card-title {
    margin-top: 10%;
    margin-bottom: 10%;
}
.product-card-price {
    font-family: "Abel", sans-serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 3%;
    letter-spacing: 0.03em;
    text-align: center;
    margin-top: 10%;
}
.product-card-add {
    width: 186px;
    height: 48px;
    padding: 12px 64px 12px 64px;
    gap: 8px;
    border-radius: 8px 0px 0px 0px;
    opacity: 0px;
    background: #000000;
    border-radius: 5%;
    font-family: "ABeeZee", sans-serif;
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    color: #FFFFFF;
}
</style>
