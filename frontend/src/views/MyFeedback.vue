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
    <div class="container text-white" align="center">
      <div class="row text-white" >
        <h1 class="display-3  text-white">
          {{ player_name }}
        </h1>
      </div>  
    </div>
    
    <div class="container">
      <card>
      <h6 class="text-primary text-uppercase">Фидбек, который оставили мне</h6>
        <div v-if="feedback.length == 0">
         У вас пока нет фидбека. :-(
        </div>
        <table class="table table-bordered">
          <thead>
            <th>Текст</th>
            <th>От кого</th>
            <th>Когда</th>
            <th>По поводу</th>
          </thead>
          <tbody>
            <tr
              v-for="item in feedback"
              :key="item.id"
            > 
              <td>
                {{ item.body }}
              </td>
              <td> {{ item.nickname }} </td>
              <td> {{ item.added_time }} </td>
              <td> <router-link :to="{
                    name: 'viewepisode', 
                    params: { id:item.episode_id }                              
                  }">
                  {{ item.name }}
                </router-link>  </td>
            </tr>
          </tbody>
        </table>    
      </card>
      <p> </p>
      <card>
      <h6 class="text-primary text-uppercase">Мои комментарии</h6>
        <div v-if="comments.length == 0">
         Додайте людям фидбека, и он здесь появится!
        </div>
        <table v-if="comments.length > 0" class="table table-bordered">
          <thead>
            <th>Текст</th>
            <th>Кому</th>
            <th>Когда</th>
            <th>По поводу</th>
          </thead>
          <tbody>
            <tr
              v-for="item in comments"
              :key="item.id"> 
              <td>
                {{ item.body }}
              </td>
              <td>
                {{ item.char_name }}
              </td>
              <td>
                {{ item.added_time }}
              </td>
              <td>
                <router-link :to="{
                    name: 'viewepisode', 
                    params: { id:item.ep_id }                              
                  }">
                  {{ item.ep_name }}
                </router-link>  
              </td>
            </tr>
          </tbody>
        </table>    
      </card>
    </div>
  </section>
</template>

<script>
import { getPlayer, getCommentsByPlayer, getFeedbackByPlayer } from '../services/PlayerService';

export default {
  name: 'MyFeedback',
  data () {
    return {
      claims: [],
      player_id: "",
      player_name: '',
      id: this.$route.params.id,
      feedback: [],
      comments: []
    }
  },
  async created () {
    const idToken = await this.$auth.tokenManager.get('idToken');
    this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
    this.claims.forEach((value) => {
      if (value.key == 'email') this.email = value.value;
    });
    getPlayer(this.email).then(response => {
        this.player_id = response[0].id;
        this.player_name = response[0].nickname;
        getFeedbackByPlayer(this.player_id).then(response => {
            this.feedback = response;
            }
        );
        getCommentsByPlayer(this.player_id).then(response => {
            this.comments = response;
            }
        );
    });
  },
  methods: {
  }
}
</script>