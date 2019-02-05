import Vue from 'vue'
import Date from '@/filters/Date'
import DateLong from '@/filters/DateLong'
import Number from '@/filters/Number'

Vue.filter('date', Date)
Vue.filter('dateLong', DateLong)
Vue.filter('number', Number)
