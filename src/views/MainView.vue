<script setup>
import {buildPath, getAllProducts } from '../api.js'

</script>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            rs: null,
            error: null,
            loading: false
        }
    },
    mounted() {
      this.getDiscountProducts();
    },
    methods: {
        ...mapActions([
            'addProduct',
        ]),
        addProductToCart(product) {
          this.addProduct(product);
        },
        async getDiscountProducts() {
            try { 
                let allProducts = await getAllProducts()
                let discountProducts = allProducts.filter(item => item.discount_price != null).sort(() => 0.5 - Math.random());
                this.rs = discountProducts.slice(0, 4);
            } catch (err) {
                this.error = err.toString()
            } finally {
                this.loading = false
            }
        }
    },
};
</script>

<template>
    <div class="categories container container-flex-column">
        <div class="categories-nav container-flex-row">
            <h2>Browse By Category</h2>
            <div class="nav-arrows">
                <img src="../resources/images/category/arrow_left.svg" style="padding-left: 32px;">
                <img src="../resources/images/category/arrow_right.svg" style="padding-left: 32px;">
            </div>
        </div>
        <div class="categories-content container-flex-row">
            <div class="category-card"><router-link to="/api/category/2"><img src="../resources/images/category/phones.svg"><p>Phones</p></router-link></div>
            <div class="category-card"><router-link to="/api/category/5"><img src="../resources/images/category/smartwatches.svg"><p>Smart Watches</p></router-link></div>
            <div class="category-card"><router-link to="/api/category/2"><img src="../resources/images/category/cameras.svg"><p>Cameras</p></router-link></div>
            <div class="category-card"><router-link to="/api/category/6"><img src="../resources/images/category/headphones.svg"><p>Headphones</p></router-link></div>
            <div class="category-card"><router-link to="/api/category/3"><img src="../resources/images/category/computers.svg"><p>Computers</p></router-link></div>
            <div class="category-card"><router-link to="/api/category/4"><img src="../resources/images/category/gaming.svg"><p>Gaming</p></router-link></div>
            <router-view></router-view>
        </div>
    </div>
    <h3 class="discount-products">Discount up to 50%</h3>
        <div v-if="rs" class="discount-product-content container-flex-row">
            <div v-for="product in rs" class="product-card container-flex-column">
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
</template>

<style scoped>
.categories {
    height: fit-content;
    background: #FAFAFA;
    align-items: center;
    align-content: center;
    padding-left: 5%;
    padding-right: 5%;
}
.categories-nav {
    width: 100%;
    font-family: "ABeeZee", sans-serif;
    font-size: 24px;
    font-style: italic;
    font-weight: 400;
    line-height: 32px;
    letter-spacing: 0.01em;
    text-align: left;
    height: fit-content;
    margin-top: 32px;
    padding-bottom: 2%;
}

.categories-content {
    width: 100%;
    height: fit-content;
    margin-bottom: 32px;
}
.category-card {
    background: #EDEDED;
    width: 160px;
    height: 128px;
    padding: 24px 52px 24px 52px;
    gap: 8px;
    border-radius: 5%;
    opacity: 0px;
    border-radius: 5%;
    font-family: "ABeeZee", sans-serif;
    font-size: 16px;
    font-style: italic;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    margin-top: 8px;
    margin-bottom: 8px;
}
.discount-products {
    font-family: 'ABeeZee';
    font-style: italic;
    font-size: 24px;
    margin-left: 15%
}

.discount-product-content {
    padding-left: 10%;
    padding-right: 10%;
    margin-bottom: 10%;
    align-self: auto;
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
