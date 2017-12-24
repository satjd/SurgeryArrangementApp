<template>
    <el-container>
        <el-row>
            <el-col :span="4">
                <div id='external-events'>
                    <h4>当前护士</h4>
                </div>
            </el-col>
            <el-col :span="20"><full-calendar :events="events" :config="config" @day-click="dayClick" @event-selected="eventClick"/></el-col>
        </el-row>
    </el-container>
</template>

<script>
var $ = require('jquery')
require('webpack-jquery-ui')
var testJSON = [
  { id: 1, name: 'nurse张三', age: 26 },
  { id: 2, name: 'nurse李四', age: 37 },
  { id: 333, name: 'nurse王五', age: 48 }
]
var calendarEvents = [
  {
    title: 'Perfect Day for Rain',
    start: '2016-08-25',
    end: '2017-05-25'
  },
  {
    title: 'Wait another month for VueConf',
    start: '2017-05-21',
    end: '2017-05-22',
    cssClass: 'vueconf'
  },
  {
    title: 'A single sunny day',
    start: '2017-05-29',
    end: '2017-05-29'
  }
]
export default {
  name: 'calendar',
  mounted: function() {
    /* initialize the external events
	-----------------------------------------------------------------*/

    $.each(testJSON, function(index, jsonObj) {
      var $extEvent = $('<div>', { id: jsonObj.id, class: 'fc-event' })
      $extEvent.text(jsonObj.id + '---' + jsonObj.name)

      // make the event draggable using jQuery UI
      $extEvent.draggable({
        zIndex: 999,
        revert: true, // will cause the event to go back to its
        revertDuration: 0 //  original position after the drag
      })

      if (jsonObj.age >= 40) {
        $extEvent.draggable('destroy')
        $extEvent.css('background-color', 'red')
        $extEvent.data(event)['startEditable'] = false
      }

      $('#external-events').append($extEvent)
    })

    $('#external-events .fc-event').each(function() {
      // store data so the calendar knows to render an event upon drop
      $(this).data('event', {
        title: $.trim($(this).text()), // use the element's text as the event title
        stick: true // maintain when user navigates (see docs on the renderEvent method)
      })
    })
  },
  data() {
    return {
      events: [],
      config: {
        header: {
          left: 'prev,next today exportArrangement importArrangement',
          center: 'title',
          right: 'monthArrange,weekArrange,dayArrange'
        },
        views: {
          monthArrange: {
            type: 'month',
            buttonText: '月排班'
          },
          weekArrange: {
            type: 'agendaWeek',
            duration: { days: 7 },
            buttonText: '周排班'
          },
          dayArrange: {
            type: 'agendaDay',
            duration: { days: 1 },
            buttonText: '日排班'
          }
        },
        customButtons: {
          exportArrangement: {
            text: '导出排班',
            click: function() {
              alert('导出' + 'events')
              var jsonArray = $.exportArrangement(
                $('#calendar').fullCalendar('clientEvents')
              )
              var data =
                'data:text/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(jsonArray))
              var a = document.createElement('a')
              a.href = data
              a.download = 'data.json'
              a.click()
            }
          },
          importArrangement: {
            text: '导入排班',
            click: function() {
              alert('导入')
              $('#myModal').modal('toggle')
            }
          }
        },
        themeSystem: 'bootstrap3',
        editable: true,
        droppable: true // this allows things to be dropped onto the calendar
      }
    }
  },
  methods: {
    dayClick() {
      this.$message('' + this.events.length)
    },
    eventClick() {
      this.$message('click')
    }
  }
}
</script>

<style>
#external-events {
  float: left;
  width: 150px;
  padding: 0 10px;
  border: 1px solid #ccc;
  background: #eee;
  text-align: left;
  user-select: none;
}

#external-events h4 {
  font-size: 16px;
  margin-top: 0;
  padding-top: 1em;
}

#external-events .fc-event {
  margin: 10px 0;
  cursor: pointer;
}

#external-events p {
  margin: 1.5em 0;
  font-size: 11px;
  color: #666;
}

#external-events p input {
  margin: 0;
  vertical-align: middle;
}
</style>


