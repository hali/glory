<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div>
    <div>
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
               Заглушка для добавить новую тему.
               <div class="row" align="right">
                  <div class="col-md-12"><base-button type="success">{{ $t('post') }}</base-button></div>
                </div>  
              </card>
            </div>
          </div>
          
        </div>
        <p />
        <div v-for="topic in topics" :key="topic.id">
          <div class="container">
          <div class="row">
            <div class="col-md-12">
              <card>
                
                <div class="row">
                    <div class="col-md-10"><b>{{topic.name}}</b></div>
                    <div class="col-md-2 text-right" v-if="topic.replies_n > 0 ">
                      <a v-if="topic.id!=expanded_topic" @click="changeExpansionStatus(topic.id)">+</a>
                      <a v-if="topic.id==expanded_topic" @click="changeExpansionStatus(topic.id)">-</a>
                    </div>
                    <hr class="col-md-11" v-if="topic.id==expanded_topic">
                    <div class="col-md-12" v-if="topic.id==expanded_topic">
                        <div v-for="reply in topic.replies" :key="reply.id" class="col-md-12">
                             <div>
                                <b>{{reply.nickname}}</b> 
                             </div> 
                             <div
                style="white-space:pre-wrap; text-justify: auto;" 
              
                v-html="reply.body"
              />
                             <hr>
                        </div>
                        <div v-if="topic.id==expanded_topic">
                          <div class="col-md-12">
                            <quill-editor
                              v-model:content="new_reply" 
                              content-type="html" 
                              :options="options"
                              class="form-control rounded-0"
                              style="height: 250px"
                              ref="myEditor"
                            />
                          </div>
                          <div class="col-md-12 text-right">
                            <base-button type="success" @click="addReplyToTopic(topic.id)">
                                {{ $t('post') }}
                            </base-button>
                          </div>
                        </div>
                    </div>
                </div>
              </card>  
            </div>
          </div>
        </div>
          <p />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { getTopics, getTopicReplies, addReply } from '../services/TopicService';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import BaseButton from '@/components/BaseButton';
import { getPlayer } from '../services/PlayerService';

export default ({
  name: 'LookingForYou',
  components: { QuillEditor, BaseButton },
  props: ['auth'],
  data() {
            return {
                current_player_id: 0,
                topics: [],
                expanded_topic: 0  ,
                new_reply: "",
                options: {
                debug: 'warn',
                modules: {
                  toolbar: [['bold', 'italic', 'underline', 'strike'],[{ 'color': [] }, { 'background': [] }], ['clean']]
                },
                readOnly: false,
                theme: 'snow'
              }
            }
        },
        async created () {
            const idToken = await this.$auth.tokenManager.get('idToken');
            this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
            this.claims.forEach((value) => {
              if (value.key == 'email') this.email = value.value;
            });
            this.url = window.location.href;
            getPlayer(this.email).then(response => {
                if (response.length > 0) 
                  this.current_player_id = response[0].id;
                getTopics(1).then(response => {
                    this.topics = response
                    });
                });
            },
  methods: {
    async login () {
      await this.$auth.signInWithRedirect({ originalUri: '/' })
    },
    async logout () {
      await this.$auth.signOut()
    },
    async changeExpansionStatus(topic) {
      if (topic == this.expanded_topic)
        this.expanded_topic = 0;
      else {
        this.expanded_topic = topic;  
        getTopicReplies(topic).then(replies => {
            this.topics.forEach(function(t) {if (t.id == topic) t.replies = replies;})
        });
      }
    },
    async addReplyToTopic(topic_id) {
        const payload = {
              topic_id: topic_id,
              body: this.new_reply,
              author_id: this.current_player_id
            };
        addReply(topic_id, payload);    
    }
  }
})
</script>
