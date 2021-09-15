<template>
  <q-page class="flex flex-center">
    <q-card v-if="cardLogin" style="width: 60%">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-separator class="q-my-xs" />

      <q-card-section class="q-pt-sm q-gutter-y-md">
        <div class="row">
          <div class="col-12">
            <q-input outlined v-model="login.email" label="Login" />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input
              label="Senha"
              v-model="login.password"
              outlined
              :type="isPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-btn
              flat
              color="primary"
              no-caps
              label="Ainda não tem login? Clique aqui"
              @click="this.cardLogin = false"
              size="sm"
            />
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              size="sm"
              icon="fas fa-sign-in-alt"
              rounded
              label="Logar"
              :disable="login.email.length === 0 || login.password.length === 0"
              @click="doLogin"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card v-else style="width: 60%">
      <q-card-section>
        <div class="text-h6">Cadastre-se</div>
      </q-card-section>

      <q-separator class="q-my-xs" />

      <q-card-section class="q-pt-sm q-gutter-y-md">
        <div class="row">
          <div class="col-12">
            <q-input outlined v-model="newUser.email" label="Login" />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input
              label="Senha"
              v-model="newUser.password"
              outlined
              :type="isPwd2 ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd2 = !isPwd2"
                />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input
              label="Senha"
              v-model="newUser.password_confirmation"
              outlined
              :type="isPwd2 ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd2 = !isPwd2"
                />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-btn
              flat
              color="primary"
              icon="fas fa-chevron-left"
              label="Voltar para login"
              no-caps
              @click="cardLogin = true"
              size="sm"
            />
          </div>
          <div class="col-auto">
            <div>
              <q-btn
                :disable="
                  newUser.email.length === 0 ||
                  newUser.password.length === 0 ||
                  newUser.password_confirmation.length === 0
                "
                color="primary"
                label="Cadastrar"
                @click="createNewUser"
                size="sm"
                rounded
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Notify from "../mixins/notify";
import axios from "axios";
import { ref } from "vue";

export default defineComponent({
  name: "PageIndex",
  mixins: [Notify],
  data() {
    return {
      isPwd: ref(true),
      isPwd2: ref(true),
      cardLogin: true,
      newUser: {
        email: "",
        password: "",
        password_confirmation: "",
        country_code: "BR",
        reffer: "demouser",
      },
      login: {
        email: "",
        password: "",
        grant_type: "password",
      },
      sendTokenData: "",
      myToken: "",
      testeToken: "",
      userId: "",
    };
  },
  created() {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      this.sendTokenData = JSON.parse(tokenData);
    }
  },
  methods: {
    createNewUser() {
      if (this.newUser.password === this.newUser.password_confirmation) {
        axios
          .post(
            "https://cda-admin-backend.herokuapp.com/api/users",
            this.newUser
          )
          .then((response) => {
            this.successNotify("Usuário cadastrado com sucesso");
            this.cardLogin = true;
            this.login.email = this.newUser.email;
            this.login.password = "";
          });
      } else {
        this.errorNotify("As senhas não são iguais");
      }
    },
    doLogin() {
      axios
        .post("https://cda-admin-backend.herokuapp.com/api/auth", this.login)
        .then((response) => {
          this.myToken = response.data.access_token;
          this.testeToken = response.data.access_token;
          this.userId = response.data.user_id;
          this.saveTokenOnLocalStorage();
          this.getContacts();
          this.successNotify("Usuário logado com sucesso");
        });
    },
    saveTokenOnLocalStorage() {
      let sendToken = localStorage.getItem("token");
      if (sendToken) {
        sendToken = JSON.parse(sendToken);
        sendToken = this.myToken;
        this.sendTokenData = this.myToken;
      } else {
        sendToken = this.myToken;
        this.sendTokenData = this.myToken;
      }
      localStorage.setItem("token", JSON.stringify(sendToken));
      this.myToken = "";
    },
    getContacts() {
      const AuthStr = "Bearer ".concat(this.testeToken);

      axios
        .get(
          `https://cda-admin-backend.herokuapp.com/api/users/${this.userId}`,
          {
            headers: { Authorization: AuthStr },
          }
        )
        .then((response) => console.log(response.data));
    },
  },
});
</script>
