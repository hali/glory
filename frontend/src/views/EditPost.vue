<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
    <div v-if="post.author_id == current_user_id">
      <div class="container">
        <div class="row text-white">
          <p class="col-md-12">
            Пост:
          </p>
        </div>
        <div class="row">  
          <div class="col-md-12">
            <textarea
              id="exampleFormControlTextarea1"
              v-model="post.body"
              name="post_body"
              class="form-control form-control-alternative"
              rows="10"
            />
          </div>
        </div>
        <div class="row">
          <p />
        </div>
        <div class="row">
          <div
            class="col-md-6"
            align="left"
          >  
            <span @click="$router.push({ name: 'viewepisode', params: { id: post.episode_id } })">
              <base-button type="secondary">
                Отмена
              </base-button></span>
          </div>
          <div
            class="col-md-6"
            align="right"
          >  
            <span @click="save"> <base-button type="success">
              Сохранить
            </base-button></span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="post.author_id != current_user_id"
      class="container"
    >
      <card>Нельзя редактировать чужие посты!</card>
    </div>
  </section>
</template>
<script>
import { updatePost, viewPost} from '../services/PostService';
import BaseButton from '@/components/BaseButton';
import { getPlayer } from '../services/PlayerService';
import { getCharacter } from '../services/CharacterService';

export default {
    name: "EditPost",
    components: { BaseButton },
    data() {
        return {
          post: {
            id: this.$route.params.id,
            episode_id: 0,
            author_id: 0,
            body: ''
          },
          current_user_id: 1,
          email: ''
        };
      },
      async mounted() {
            const idToken = await this.$auth.tokenManager.get('idToken');
            this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
            this.claims.forEach((value) => {
              if (value.key == 'email') this.email = value.value;
            });
            getPlayer(this.email).then(response => {
                this.current_user_id = response[0].id;
            });
            viewPost(this.post.id).then(response => {
                this.post.episode_id = response[0].episode_id;
                this.post.body = response[0].body;
                getCharacter(response[0].author_id).then(response => {
                  this.post.author_id = response[0].player_id;
                });
                
            });
        },
    methods: {
      save() {
        let processed_description = this.post.body.replace('- ', '— ');
        const payload = {
              body: processed_description,
              id: this.post.id
          };
          updatePost(this.post.id, payload).then(() => {
            this.$router.push({name:'viewepisode', params:{id:this.post.episode_id}})
          });
      } 
    }  
};
</script>
<style>
</style>
