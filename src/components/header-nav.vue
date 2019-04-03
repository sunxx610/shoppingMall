<template>
  <div id="header">
    <div class="nav-global">
      <div class="container">
        <router-link
            class="nav-logo"
            tag="h1"
            :to="{name:'Shop'}"
            exact><a href="javascript:;"></a>
        </router-link>
        <ul class="nav-aside">
          <li class="nav-user" @click="toAccountPage">
            <a href="javascript:;" @mouseenter="hideCartHandle('flag')" >My Info</a>
            <!--active-->
            <div class="nav-user-wrapper">
              <div class="nav-user-list">
                <dl class="nav-user-avatar">
                  <dd><span class="ng-scope"></span></dd>
                  <dt class="ng-binding" v-if="userName">Hello, {{userName}}</dt>
                  <dt class="ng-binding" v-if="!userName">Hello, please <strong @click="showSignPanel('signIn')">sign
                    in.</strong></dt>
                </dl>
                <ul>
                  <li v-for="opt in accountOptions" :class="opt.classN">
                    <router-link
                        :to="opt.link"
                        tag="a"
                        v-show="userName"
                        exact
                    > {{opt.name}}
                    </router-link>
                  </li>
                  <li class="logout" @click="logout">
                    <a
                        href="javascript:;"
                        v-show="userName"
                    > Sign out
                    </a>
                  </li>
                  <li class="" @click="showSignPanel('signIn')">
                    <a
                        href="javascript:;"
                        v-show="!userName"
                    > Sign in
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <!--active-->
          <cart-panel></cart-panel>

        </ul>
        <div class="nav-list-trigger" @click="showHeaderNavLiHandle"></div>
        <ul class="nav-list" :class="{'nav-list-show':headerNavLiShow}" >
          <router-link
              tag="li"
              :to="{name:'Shop'}"
              class="information"
              exact><a href="javascript:;" @click="hideHeaderNavLiHandle">Products</a>
          </router-link>
          <router-link
              to="/account"
              tag="li"
              exact
              class="order"
          >
            <a href="javascript:;" @click="hideHeaderNavLiHandle">Orders history</a>
          </router-link>
          <router-link
              to="/account/addresses"
              tag="li"
              exact
              class="address"
          >
            <a href="javascript:;" @click="hideHeaderNavLiHandle">Manage addresses</a>
          </router-link>
          <router-link
              to="/account/coupons"
              tag="li"
              exact
              class="coupon"
          >
            <a href="javascript:;" @click="hideHeaderNavLiHandle">Manage coupons</a>
          </router-link>
          <li class="support"><a href="javascript:;" style="
    color: grey;" @click="hideHeaderNavLiHandle">About me</a></li>
        </ul>
      </div>
    </div>
    <div class="occupy-fix"></div>
    <div class="mask" v-show="maskFlag" @click="closeSign"></div>
    <div class="sign-panel-div">
      <sign-panel v-show="signFlag==='signIn'" @signClose="closeSign">
        <template slot="title">
          <h4>Login with username and password</h4>
        </template>
        <template slot="form">
          <form class="login-form" name="form">
            <ul class="clearFloat">
              <li class="username">
                <div class="input" style="opacity: 0.618;">
                  <input
                      type="text"
                      id="log-username"
                      v-model="iUserName"
                      name="username"
                      placeholder="Please input username"
                  >
                  <span id="log-u-format-error" class="warning " style="display: none">
                    Phone number/email format wrong.
                  </span>
                </div>
              </li>
              <li class="password">
                <div class="input" style="opacity: 0.618;">
                  <input
                      type="password"
                      id="log-password"
                      v-model="userPwd"
                      name="password"
                      @keyup.enter="loginActHandle"
                      placeholder="Please input password"
                  >
                  <span class="log-error" style="display: block; height:0" v-show="logErrorTip"
                  >Username or password is wrong.</span>

                </div>
              </li>
              <li class="remember">
                <div class="auto  clearFloat" @click="rememberLogin"
                >
                  <span
                      class="blue-checkbox"
                      :class="{checked:rememberSign}"
                  ></span>
                  <a href="javascript:;">Remember login</a>
                </div>
                <a class="registercloud " href="javascript:;" @click="showSignPanel('signUp')">Register now</a></li>
            </ul>
            <div class="btn-wrapper">
              <div class="btn btn-primary <!--disabled-->" @click="loginActHandle"><a
                  href="javascript:;"
                  role="button">Login</a></div>
            </div>
          </form>
        </template>
      </sign-panel>
      <sign-panel v-show="signFlag==='signUp'" @signClose="closeSign">
        <template slot="title">
          <h4>Login with username and password</h4>
        </template>
        <template slot="form">
          <form class="login-form " name="form">
            <ul class="clearFloat">
              <li class="username">
                <div class="input" style="opacity: 0.618;">
                  <span class="icon">
                  <i></i>
                  </span>
                  <input
                      type="text"
                      id="username"
                      v-model="iUserName"
                      name="username"
                      placeholder="Please input username"
                  >
                  <span id="u-format-error" class="warning" style="display: none">
                    Phone number/email format wrong
                  </span>
                </div>
              </li>
              <li class="password">
                <div class="input" style="opacity: 0.618;">
                  <input
                      type="password"
                      id="password"
                      v-model="userPwd"
                      name="password"
                      placeholder="Please input password"
                      @blur="verifyRegisterPwd"
                      @keyup="verifyRegisterPwd"
                  >
                  <span id="p-error" class="warning" style="display: none"
                  >Password wrong</span>
                </div>
              </li>
              <li class="verifyPassword">
                <div class="input" style="opacity: 0.618;">
                  <input
                      type="password"
                      id="verifyPassword"
                      v-model="validUserPwd"
                      name="verifyPassword"
                      placeholder="Please repeat password"
                      @blur="verifyRegisterPwd"
                      @keyup="verifyRegisterPwd"
                  >
                  <span class="reg-error" style="display: block" v-show="regErrorTip"
                  >{{regErrorMsg}}</span>
                </div>
              </li>
              <li class="remember">
                <div class="auto clearFloat" @click="rememberLogin">
                  <span
                      class="blue-checkbox"
                      :class="{'checked':rememberSign}"
                  ></span>
                  <a href="javascript:;">Remember login</a>
                </div>
                <a class="login signUp-a" href="javascript:;" @click="showSignPanel('signIn')">Login now</a></li>
            </ul>
            <div class="btn-wrapper">
              <div class="btn btn-primary" @click="RegisterActHandle">
                <a role="button" href="javascript:;">Register</a>
              </div>
            </div>
          </form>
        </template>
      </sign-panel>
    </div>

  </div>
</template>

<script>
  import cartPanel from '@/components/cart-panel'
  import signPanel from '@/components/sign-panel'

  export default {
    name: "header-nave",
    components: {
      cartPanel,
      signPanel
    },
    data() {
      return {
        iUserName: '',
        userPwd: '',
        validUserPwd: '',
        rememberSign: true,
        accountOptions: [
          {
            name: "My orders",
            link: '/account',
            classN: 'order'
          },
          {
            name: "My address",
            link: '/account/addresses',
            classN: 'address'
          },
          {
            name: "My coupons",
            link: '/account/coupons',
            classN: 'coupon'
          }, /*
          {
            name: "Supports",
            link: '',
            classN: 'support'
          }*/
        ]
      }
    },
    computed: {
      userName() {
        console.log('computed: ', this.$store.state.userName)
        return this.$store.state.userName;
      },
      maskFlag() {
        return this.$store.state.maskFlag;
      },
      signFlag() {
        return this.$store.state.signFlag;
      },
      logErrorTip() {
        return this.$store.state.logErrorTip;
      },
      regErrorTip() {
        return this.$store.state.regErrorTip;
      },
      regErrorMsg() {
        return this.$store.state.regErrorMsg;
      },
      headerNavLiShow(){
        return this.$store.state.headerNavLiShow;
      }
    },
    mounted() {
      this.$store.dispatch('checkLoginAct');
    },
    methods: {
      toAccountPage(){
        this.$router.push('account')
      },
      showHeaderNavLiHandle(){
        this.$store.commit('showHeaderNavLi');
      },
      hideHeaderNavLiHandle(){
        this.$store.commit('showHeaderNavLi');
      },
      showSignPanel(flag) {
        this.$store.commit('showSign', flag);
      },
      loginActHandle() {
        let iUserName = this.iUserName.trim(),
          userPwd = this.userPwd.trim();
        if (!iUserName || !userPwd) {
          this.$store.commit('showLogErrorTip');
        } else {
          this.$store.dispatch('loginAct', {
            userName: iUserName,
            userPwd: userPwd,
            rememberSign: this.rememberSign
          })
        }
      },
      RegisterActHandle() {
        let iUserName = this.iUserName.trim(),
          userPwd = this.userPwd.trim();
        this.verifyRegisterPwd();
        if (!this.regErrorTip) {
          this.$store.dispatch('registerAct', {
            userName: iUserName,
            userPwd,
            rememberSign: this.rememberSign
          })
        }
      },
      logout() {
        this.$store.dispatch('logoutAct');
        this.iUserName = '';
        this.userPwd = '';
      },
      rememberLogin() {
        console.log(this.rememberSign)
        this.rememberSign = !this.rememberSign;
      },
      closeSign() {
        this.$store.commit('hideSign');
        this.$store.commit('hideAllList');
      },
      hideCartHandle(flag) {
        this.$store.commit('hideCart', flag)
      },
      showRegErrorTip(msg) {
        this.$store.commit('showRegErrorTip', msg);
      },
      hideRegErrorTip() {
        this.$store.commit('hideRegErrorTip');
      },
      verifyRegisterPwd() {
        let iUserName = this.iUserName.trim(),
          userPwd = this.userPwd.trim(),
          validUserPwd = this.validUserPwd.trim();
        if (!iUserName || !userPwd || !validUserPwd) {
          this.showRegErrorTip('Username,password or valid password can\'t be empty.')
        } else {
          if (userPwd != validUserPwd) {
            this.showRegErrorTip('The passwords you typed in is different.')
          } else {
            this.hideRegErrorTip()
          }
        }
      }
    }
  }
</script>
