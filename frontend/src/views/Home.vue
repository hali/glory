<template>
  <div>
    <section
      v-if="isLoading"
      class="section"
      role="status"
      aria-live="polite"
    >
      <div class="container">
        {{ $t('checkingSession') }}
      </div>
    </section>
    <div
      v-else-if="!isAuthenticated"
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

    <div v-else>
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
                <p
                  v-if="episodesLoading"
                  role="status"
                >
                  {{ $t('loadingUpdates') }}
                </p>
                <div
                  v-else-if="episodesError"
                  role="alert"
                >
                  <p>{{ $t('updatesLoadError') }}</p>
                  <base-button
                    type="primary"
                    @click="getLatestEpisodeData"
                  >
                    {{ $t('retry') }}
                  </base-button>
                </div>
                <p v-else-if="episodes.length === 0">
                  {{ $t('noUpdates') }}
                </p>
                <table
                  v-else
                  class="table table-bordered"
                >
                  <thead>
                    <tr>
                      <th>{{ $t('story') }}</th>
                      <th>{{ $t('messageAuthor') }}</th>
                      <th>{{ $t('messageTime') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in episodes"
                      :key="item.post_id"
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
import { useAuth0 } from '@auth0/auth0-vue';

export default {
  name: 'Home',
  setup() {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    return { isAuthenticated, isLoading, loginWithRedirect };
  },
  data() {
    return {
      episodes: [],
      episodesLoading: false,
      episodesError: false,
      episodesRequestId: 0,
      episodes_n: '...',
      characters_n: '...',
      posts_n: '...',
    };
  },
  computed: {
    homeState() {
      if (this.isLoading) return 'loading';
      return this.isAuthenticated ? 'authenticated' : 'guest';
    },
  },
  watch: {
    homeState: {
      immediate: true,
      handler(state) {
        // Invalidate responses from an earlier session before loading new data.
        this.episodesRequestId += 1;
        this.episodes = [];
        this.episodesLoading = false;
        this.episodesError = false;
        if (state === 'authenticated') {
          this.getLatestEpisodeData();
        } else if (state === 'guest') {
          this.getPublicStats();
        }
      },
    },
  },
  created() {
    document.title = 'Glory';
  },
  beforeUnmount() {
    this.episodesRequestId += 1;
  },
  methods: {
    getPublicStats() {
      getEpisodesCount().then(response => {
        if (response && response[0]) this.episodes_n = response[0].episodes_n;
      }).catch(err => console.error('Error fetching episode count:', err));
      getCharactersCount().then(response => {
        if (response && response[0]) this.characters_n = response[0].characters_n;
      }).catch(err => console.error('Error fetching character count:', err));
      getPostsCount().then(response => {
        if (response && response[0]) this.posts_n = response[0].posts_n;
      }).catch(err => console.error('Error fetching post count:', err));
    },
    async login() {
      try {
        // Auth0 owns authentication state; the watcher loads data after redirect.
        await this.loginWithRedirect();
      } catch (error) {
        console.error('Login error:', error);
      }
    },
    async getLatestEpisodeData() {
      if (this.homeState !== 'authenticated' || this.episodesLoading) return;
      const requestId = ++this.episodesRequestId;
      this.episodesLoading = true;
      this.episodesError = false;
      try {
        const response = await getLatestEpisodes();
        if (requestId !== this.episodesRequestId) return;
        if (!Array.isArray(response)) {
          throw new Error('Unexpected response format for latest updates');
        }
        this.episodes = response;
      } catch (error) {
        if (requestId !== this.episodesRequestId) return;
        console.error('Error fetching latest updates:', error);
        this.episodes = [];
        this.episodesError = true;
      } finally {
        if (requestId === this.episodesRequestId) this.episodesLoading = false;
      }
    },
  },
};
</script>
