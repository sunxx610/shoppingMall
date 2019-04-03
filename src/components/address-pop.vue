<template>
  <div id="pop">
    <div class="module-dialog-layer" style="display: block;"></div>
    <div class="module-dialog clear module-dialog-address module-dialog-show">
      <div class="dialog-panel">
        <div class="topbar">
          <div class="dialog-tit clear">
            <h4 class="js-dialog-title">Edit shipping address</h4>
          </div>
          <span class="dialog-close" @click="closePop">x</span>
        </div>
        <div class="dialog-con js-dialog-container">
          <div class="animate-layer">
            <div class="dialog-inner js-address-add">
              <div class="save-address-box">
                <div class="address-form">
                  <div class="module-form-row">
                    <div class="form-item-v3">
                      <input
                          type="text"
                          placeholder="Full name"
                          class="js-verify"
                          v-model="newReceiverInfo.name">
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div class="module-form-row">
                    <div
                        class="form-item-v3"
                        :class="{'form-invalid-item':phoneErr}"
                    >
                      <input
                          type="text"
                          placeholder="Phone number"
                          class="js-verify"
                          v-model="newReceiverInfo.tel"
                          @blur="inspectPhoneNum"
                          @focus="phoneErrOff"
                      >
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div class="module-form-row">
                    <div class="form-item-v3">
                      <input
                          type="text"
                          placeholder="street and number,P.O. box,c/o"
                          class="js-verify"
                          v-model="newReceiverInfo.streetName">
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div class="module-form-row">
                    <div class="form-item-v3 address2">
                      <input
                          type="text"
                          placeholder="Apt no. (optional)"
                          class="js-verify"
                          v-model="newReceiverInfo.streetName2">
                      <div class="verify-error"></div>
                    </div>

                    <div class="form-item-v3 zipCode">
                      <input
                          type="text"
                          placeholder="ZipCode"
                          class="js-verify"
                          v-model="newReceiverInfo.zipCode">
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div class="module-form-row clear">
                    <div class="form-item-v3 select-item state-wrapper">
                      <select name="state_code" class="state select-state js-form-state js-verify"
                              v-model="newReceiverInfo.stateId">
                        <option value="0">Select state</option>
                        <option
                            v-for="state in stateList"
                            :value="state.area_id"
                        >{{state.area_name}}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="module-form-row clear">
                    <div class="form-item-v3 select-item city-wrapper fn-left form-focus-item">
                      <select class="city select-city js-form-city js-verify"
                              v-model="newReceiverInfo.cityId">
                        >
                        <option value="0">Select city</option>
                        <option
                            v-for="city in cityList"
                            :value="city.area_id"
                        >{{city.area_name}}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="module-form-row fn-clear">
                    <input type="checkbox" class="hide">
                    <span
                        class="blue-checkbox"
                        :class="{'blue-checkbox-on':isDefault}"
                        @click="setDefault"
                    ></span>Set as default
                  </div>
                  <div
                      class="dialog-blue-btn big-main-btn js-verify-address"
                      :class="{'disabled-btn':!shipInfoCorrect}"
                      @click="saveNewAddressInfo"
                  >
                    <a>Save</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "address-pop",
    data() {
      return {
        newReceiverInfo: {
          'name': '',
          'streetName': '',
          'streetName2': '',
          'cityId': 0,
          'city': '',
          'stateId': 0,
          'state': '',
          'zipCode': '',
          'tel': '',
          'isDefault': false
        },
        stateList: [
          {
            'area_id': 110000,
            'area_name': 'CA',
            'city_list':
              [
                {
                  'area_name': 'Los Angeles',
                  'area_id': 110100
                },
                {
                  'area_name': 'San Francisco',
                  'area_id': 110200
                }
              ]
          },
          {
            'area_id': 440000,
            'area_name': 'MN',
            'city_list':
              [
                {
                  'area_id': 440300,
                  'area_name': 'Minneapolis'
                },
                {
                  'area_id': 440100,
                  'area_name': 'St.Paul'
                }
              ]
          },
          {
            'area_id': 310000,
            'area_name': 'IL',
            'city_list':
              [
                {
                  'area_id': 310100,
                  'area_name': 'Chicago'
                },
                {
                  'area_id': 310200,
                  'area_name': 'Danville'
                }
              ]
          }],
        cityList: [],
        phoneErr: false,
        isDefault: false,
        shipInfoCorrect: false,
        stateId: ''/*解决this.$store.state.selectedAddressData.cityId存在时，改变stateId时，store的stateId一起改变的bug*/
      }
    },
    props: {
      'selectAddress': {
        type: Object
      }
    },
    mounted() {
      this.stateId = this.$store.state.selectedAddressData.stateId;
      if (this.$store.state.selectedAddressData.stateId) {
        let selectedAddressData = this.$store.state.selectedAddressData;
        if (selectedAddressData !== 'new') {
          this.newReceiverInfo = selectedAddressData;
        }
      }
    }
    ,
    watch: {
      'newReceiverInfo.stateId'() {
        this.getCityList();
        if (this.$store.state.selectedAddressData.cityId) {
          console.log(this.stateId)
          console.log(this.newReceiverInfo.stateId)
          if (this.stateId == this.newReceiverInfo.stateId)
            this.newReceiverInfo.cityId = this.$store.state.selectedAddressData.cityId;
          else
            this.newReceiverInfo.cityId = 0;
        }
        else {
          this.newReceiverInfo.cityId = 0;
        }

      },
      newReceiverInfo: {
        handler() {
          this.inspectShipInfo()
        },
        deep: true
      }
    },
    computed: {},
    methods: {
      getCityList() {
        if (this.newReceiverInfo.stateId) {
          this.stateList.forEach(state => {
            if (state.area_id == this.newReceiverInfo.stateId) {
              this.cityList = state.city_list;
              return;
            }
          });
        }
      },
      closePop() {
        this.$emit('closePop');
      },
      inspectPhoneNum() {
        let phoneNum = this.newReceiverInfo.tel.replace(/[^0-9]/ig, "");
        if (phoneNum.length === 10) {
          phoneNum = '1' + phoneNum;
        }
        if (phoneNum.length === 11) {
          this.newReceiverInfo.tel = phoneNum.slice(0, 1) + '(' + phoneNum.slice(1, 4) + ')' + phoneNum.slice(4, 7) + '-' + phoneNum.slice(7 - 11);
        } else {
          this.phoneErr = true;
        }
      },
      phoneErrOff() {
        this.phoneErr = false;
      },
      setDefault() {
        this.isDefault = !this.isDefault;
      },
      inspectShipInfo() {
        if (this.newReceiverInfo.name.trim() && !this.phoneErr && this.newReceiverInfo.tel.trim() && this.newReceiverInfo.stateId != 0 && this.newReceiverInfo.cityId != 0 && this.newReceiverInfo.streetName.trim() && this.newReceiverInfo.zipCode.trim()) {
          this.shipInfoCorrect = true
        } else {
          this.shipInfoCorrect = false
        }
      },
      saveNewAddressInfo() {
        if (this.shipInfoCorrect) {
          this.stateList.forEach(state => {
            if (state.area_id == this.newReceiverInfo.stateId) {
              this.newReceiverInfo.state = state.area_name;
              state.city_list.forEach(city => {
                if (city.area_id == this.newReceiverInfo.cityId) {
                  this.newReceiverInfo.city = city.area_name;
                }
              })
            }
          });
          this.newReceiverInfo.isDefault = this.isDefault;
          if (this.$store.state.selectedAddressData.cityId) {
            this.$store.dispatch('editAddressAct', this.newReceiverInfo);
          } else {
            this.$store.dispatch('addNewAddressAct', this.newReceiverInfo);
          }
        }
        this.$emit('closePop')
      }
    }
  }
</script>

<style scoped>
  #pop .module-dialog-layer {
    display: none;
    position: fixed;
    _position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: .6;
  }

  #pop .module-dialog .dialog-panel, .module-dialog:after {
    display: inline-block;
    vertical-align: middle;
  }

  #pop .module-dialog:after {
    content: '';
    height: 100%;
    margin-left: -.25em;
  }

  #pop .module-dialog {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1001;
    text-align: center;
    opacity: 0;
    transition: opacity .2s ease-in;
  }

  #pop .module-dialog-show {
    opacity: 1;
  }

  #pop .module-dialog .dialog-panel {
    position: relative;
    width: 450px;
    min-width: 200px;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .1) inset, 1px 0 3px rgba(0, 0, 0, .1);
    text-align: left;
    height: 592px;
  }

  #pop .module-dialog .topbar {
    overflow: hidden;
    width: 100%;
    height: 60px;
    background: linear-gradient(#FFF, #F5F5F5);
    border-bottom: 1px solid #DCDCDC;
    border-radius: 10px 10px 0 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, .1);
  }

  #pop .module-dialog-address .topbar {
    position: relative;
    z-index: 10;
  }

  #pop .module-dialog .dialog-tit {
    height: 60px;
    padding: 0 15px;
    line-height: 60px;
  }

  #pop .module-dialog .dialog-tit h4 {
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    color: #666;
  }

  #pop .module-dialog .dialog-close {
    overflow: hidden;
    display: block;
    position: absolute;
    right: 10px;
    top: 15px;
    z-index: 20;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 30px;
    color: #000;
    opacity: .2;
    cursor: pointer;
    transition: all .3s linear;
  }

  #pop .module-dialog .dialog-close:hover {
    opacity: .3;
  }

  #pop .module-dialog .animate-layer {
    position: relative;
  }

  #pop .module-dialog-address .save-address-box {
    width: 450px;
    padding-top: 29px;
  }

  #pop .address-form {
    width: 370px;
    margin: 0 auto;
  }

  #pop .account-address .address-form {
    padding: 30px;
    margin: 0;
  }

  #pop .module-form-row {
    position: relative;
    padding-bottom: 10px;
    margin: 0 auto;
  }

  #pop .address-form .module-form-row {
    padding-bottom: 15px;
  }

  #pop .module-form-row .form-item-v3 {
    position: relative;
    height: 46px;
    background: #FFF;
    border: 1px solid #CCC;
    border-radius: 6px;
    box-shadow: 0 3px 5px -4px rgba(0, 0, 0, .4) inset, -1px 0 3px -2px rgba(0, 0, 0, .1) inset;
    line-height: 46px;
    font-size: 18px;
    opacity: .618;
    transition: opacity .3s ease;
  }

  #pop .module-form-row .form-item-v3 i {
    position: absolute;
    left: 15px;
    top: 0;
    font-size: 16px;
    color: #BEBEBE;
  }

  #pop .module-form-row .form-item-v3 input {
    padding: 0 15px;
    background-color: transparent;
    border: none;
    font-size: 16px;
  }

  #pop .address-form .form-item-v3 input {
    /*width: 330px;*/
    width: 90%;
  }

  #pop .address-form .address2 {
    display: inline-block;
    width: 65%;
  }

  #pop .address-form .zipCode {
    float: right;
    width: 30%;
  }

  #pop .address-form .area-code-w {
    width: 118px;
  }

  #pop .address-form .telephone-w {
    width: 238px;
  }

  #pop .module-form-row div.select-item {
    width: auto;
    height: auto;
    margin: 0;
    background: 0 0;
    border: none;
    box-shadow: none;
    opacity: 1;
  }

  #pop .module-form-row .form-item-v3 select {
    margin: 0 0 0 15px;
    background-color: transparent;
    border: none;
    font-size: 16px;
    color: #333;
  }

  #pop .address-form .select-state {
    width: 370px;
  }

  #pop .form-focus-item {
    z-index: 1;
    opacity: 1;
    border: 1px solid #6B93F2;
  }

  #pop .module-form-row div.select-item {
    width: auto;
    height: auto;
    margin: 0;
    background: 0 0;
    border: none;
    box-shadow: none;
    opacity: 1;
  }

  #pop .module-form-row .form-item-v3 select {
    height: 48px;
    padding: 0 15px;
    margin: 0;
    background: -webkit-linear-gradient(top, #FAFAFA, #F5F5F5);
    background: linear-gradient(#FAFAFA, #F5F5F5);
    border: 1px solid #CCC;
    border-radius: 6px;
    box-shadow: 2px 0 0 rgba(255, 255, 255, .4) inset, 1px 0 0 rgba(255, 255, 255, .3);
    line-height: 48px;
    text-indent: 0;
    outline: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
  }

  #pop .address-form .select-city, .address-form .select-district {
    width: 180px;
  }

  #pop .blue-checkbox, .blue-checkbox-disable {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
    background: url(../assets/img/checkbox-bg.png) no-repeat;
    cursor: pointer;
  }

  #pop .blue-checkbox-on {
    background: url(../assets/img/checkbox-bg.png) no-repeat bottom;
  }

  #pop .address-form .blue-checkbox {
    top: 0;
    float: left;
    margin-right: 5px;
  }

  #pop .dialog-blue-btn {
    padding: 1px;
    background: #6383C6;
    background: linear-gradient(#6383C6, #4262AF);
    border-radius: 6px;
    text-align: center;
    color: #FFF;
  }

  #pop .disabled-btn {
    opacity: .4;
  }

  #pop .disabled-btn, .disabled-btn a {
    cursor: not-allowed;
    -webkit-transition: none;
    transition: none;
    pointer-events: none;
  }

  #pop .dialog-blue-btn a {
    display: block;
    padding: 2px 0;
    background: #5F7ED7;
    background: linear-gradient(#6F97E5, #527ED9);
    border-radius: 5px;
    box-shadow: inset 0 1px 2px #7EA1E8;
    text-shadow: 0 -1px 0 #4F70B3;
    color: #FFF;
  }

  #pop .big-main-btn a {
    height: 42px;
    line-height: 42px;
    font-size: 18px;
  }

  #pop .module-form-row .form-invalid-item {
    opacity: 1;
    border: 1px solid #D16D62;
  }

  #pop .module-form-row .form-invalid-item:after {
    visibility: visible;
    opacity: 1;
  }


</style>