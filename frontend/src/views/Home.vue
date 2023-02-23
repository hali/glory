<template>
  <div>
    <div class="position-relative">
      <!-- shape Hero -->
      <section class="section-shaped my-0 ">
        <div class="shape shape-style-1 shape-dark shape-skew">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div class="container shape-container d-flex">
          <div class="col px-0">
            <div class="row">
              <div class="col-lg-6">
                <h1 class="display-3  text-white">
                  Ролевка [В РАЗРАБОТКЕ]
                  <span>с анархией и тиранией</span>
                </h1>
                <p class="lead  text-white">
                  Сайт, созданный ролевиком для ролевиков, с минимумом драмы и максимумом удобства. Ура самоуправлению!
                </p>
                <div
                  v-if="authState && authState.isAuthenticated"
                  class="btn-wrapper"
                >
                  <base-button
                    tag="a"
                    class="mb-3 mb-sm-0"
                    type="info"
                    icon="fa fa-sign-in"
                    @click="logout"
                  >
                    Выйти
                  </base-button>                                    
                </div>
                <div
                  v-else
                  class="btn-wrapper"
                >
                  <base-button
                    tag="a"
                    class="mb-3 mb-sm-0"
                    type="info"
                    icon="fa fa-sign-in"
                    @click="login"
                  >
                    Войти
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 1st Hero Variation -->
    </div>
    <section class="section section-lg pt-lg-0 mt--200">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12">
            <div class="row row-grid">
              <div class="col-lg-4">
                <card
                  class="border-0"
                  hover
                  shadow
                  body-classes="py-5"
                >
                  <icon
                    name="ni ni-check-bold"
                    type="primary"
                    rounded
                    class="mb-4"
                  />
                  <h6 class="text-primary text-uppercase">
                    Быстрый старт
                  </h6>
                  <p class="description mt-3">
                    Регистрация занимает пару минут и даёт доступ ко всему контенту сайта. Никаких анкет, танцев с внешками и административными темами и премодерации - начинайте играть сразу после регистрации. Или не начинайте. Здесь никто никого никуда не гонит.
                  </p>
                </card>
              </div>
              <div class="col-lg-4">
                <card
                  class="border-0"
                  hover
                  shadow
                  body-classes="py-5"
                >
                  <icon
                    name="ni ni-istanbul"
                    type="success"
                    rounded
                    class="mb-4"
                  />
                  <h6 class="text-success text-uppercase">
                    Удобная навигация
                  </h6>
                  <p class="description mt-3">
                    Организация эпизодов по веткам, персонажам и игрокам. Тэги и предупреждения. Автоматическая игровая хронология. Экспорт эпизодов и целых веток. Найти нужное или перечитать любимое еще никогда не было так просто.
                  </p>
                </card>
              </div>
              <div class="col-lg-4">
                <card
                  class="border-0"
                  hover
                  shadow
                  body-classes="py-5"
                >
                  <icon
                    name="ni ni-planet"
                    type="warning"
                    rounded
                    class="mb-4"
                  />
                  <h6 class="text-warning text-uppercase">
                    Самоуправление
                  </h6>
                  <p class="description mt-3">
                    Создавайте, редактируйте и закрывайте свои эпизоды самостоятельно. Пишите анкеты, или не пишите. Играйте с той скоростью, с которой комфортно, выкладывайте сольные эпизоды или не очень сольные. Или читайте молча - так тоже можно, да.
                  </p>
                </card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default ({
  name: 'Home',
  methods: {
    async login () {
      await this.$auth.signInWithRedirect({ originalUri: '/' })
    },
    async logout () {
      await this.$auth.signOut()
    }
  }
})
</script>
