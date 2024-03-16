<template>
  <div>
    <div
      v-if="!(authState && authState.isAuthenticated)"
    >
      <!-- shape Hero -->
      <section class="section-shaped my-0  ">
        <div class="shape shape-style-1 shape-dark">
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
              <div class="col-lg-12">
                <h1 class="display-3  text-white">
                  {{ $t('gloryTitle') }}
                </h1>
                <p class="lead  text-white">
                  {{ $t('gloryDescription') }}
                </p>
                <div
                  class="btn-wrapper"
                >
                  <base-button
                    tag="a"
                    class="mb-3 mb-sm-0"
                    type="info"
                    icon="fa fa-sign-in"
                    @click="login"
                  >
                    {{ $t('login') }}
                  </base-button>
                </div>
                <p />
                <div class="row text-white">
                  <div class="col-lg-3">
                    {{ $t('totalCharacters') }}: {{ characters_n }}
                  </div>
                  <div class="col-lg-3">
                    {{ $t('totalStories') }}: {{ episodes_n }}
                  </div>
                  <div class="col-lg-3">
                    {{ $t('totalPosts') }}: {{ posts_n }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container my-4">
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
                      {{ $t('quickStart') }}
                    </h6>
                    <p class="description mt-3">
                      {{ $t('quickStartDetails') }}
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
                      {{ $t('navigation') }}
                    </h6>
                    <p class="description mt-3">
                      {{ $t('navigationDetails') }}
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
                      {{ $t('selfGovernance') }}
                    </h6>
                    <p class="description mt-3">
                      {{ $t('selfGovernanceDetails') }}
                    </p>
                  </card>
                  <p />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="authState && authState.isAuthenticated">
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
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <card>
               Пожалуйста, прочтите объявление во <a href=/episode/114>временной админке</a>!
              </card>
            </div>
          </div>
        </div>
        <p />
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <card>
                <h6 class="text-primary text-uppercase">
                  {{ $t('newPosts') }}
                </h6>
                <table class="table table-bordered">
                  <thead>
                    <th>{{ $t('story') }}</th>
                    <th>{{ $t('messageAuthor') }}</th>
                    <th>{{ $t('messageTime') }}</th>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in episodes"
                      :key="item.id"
                    > 
                      <td>
                        <router-link
                          :to="{
                            name: 'viewepisode', 
                            params: { id:item.id },
                            hash: '#' + item.post_id                              
                          }"
                        >
                          {{ item.name }}
                        </router-link>
                      </td>
                      <td>{{ item.char_name }}</td>
                      <td>{{ item.added_time }}</td>
                    </tr>
                  </tbody>
                </table>
              </card>  
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { getLatestEpisodes } from '../services/EpisodeService';
import { getEpisodesCount, getCharactersCount, getPostsCount } from '../services/StatsService';

export default ({
  name: 'Home',
  props: ['auth'],
  data() {
            return {
                episodes: [],
                episodes_n: '...',
                characters_n: '...',
                posts_n: '...'
            }
        },
        async created () {
            const idToken = await this.$auth.tokenManager.get('idToken');
            if (this.authState && this.authState.isAuthenticated) {
                this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
                this.claims.forEach((value) => {
                  if (value.key == 'email') this.email = value.value;
                });
                document.title = "Glory"; 
            }
              getEpisodesCount().then(response => {this.episodes_n = response[0].episodes_n});
              getCharactersCount().then(response => {this.characters_n = response[0].characters_n});
              getPostsCount().then(response => {this.posts_n = response[0].posts_n});
              getLatestEpisodes().then(response => this.episodes = response);
          },
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
