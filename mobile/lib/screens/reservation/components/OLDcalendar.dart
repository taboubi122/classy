/*import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

class calendrier extends StatefulWidget {
  @override
  _CalendrierState createState() => _CalendrierState();
}

class _CalendrierState extends State<calendrier> {
  CalendarFormat _calendarFormat = CalendarFormat.week;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  DateTime kFirstDay = DateTime.now().subtract(Duration(days: 90));
  DateTime kLastDay = DateTime.now().add(Duration(days: 90));

  List<String> _days = [
    'Monday',
    'Tuesday',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche'
  ];

  List<List<String>> _hours = [
    [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
    ],
    [
      '09:30',
      '10:30',
      '11:30',
      '12:30',
    ],
    [
      '10:00',
      '11:00',
      '12:00',
      '13:00',
    ],
    ['14:30', '15:30', '16:30'],
    ['11:00', '12:00', '18:00', '19:00'],
    [
      '10:30',
      '11:30',
      '12:30',
    ],
    [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
    ],
  ];

  List<String> selectedDayAvailability = [];

  @override
  void initState() {
    super.initState();
    selectedDayAvailability =
        _hours[_days.indexOf(_days[_focusedDay.weekday - 1])];
    print(selectedDayAvailability);
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          TableCalendar(
            firstDay: kFirstDay,
            lastDay: kLastDay,
            focusedDay: _focusedDay,
            calendarFormat: _calendarFormat,
            selectedDayPredicate: (day) {
              return isSameDay(_selectedDay, day);
            },
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
              });
            },
            onFormatChanged: (format) {
              if (_calendarFormat != format) {
                setState(() {
                  _calendarFormat = format;
                });
              }
            },
            onPageChanged: (focusedDay) {
              _focusedDay = focusedDay;
              selectedDayAvailability =
                  _hours[_days.indexOf(_days[_focusedDay.weekday - 1])];
            },
            headerStyle: const HeaderStyle(
              formatButtonVisible: false,
              titleCentered: true,
              formatButtonPadding: EdgeInsets.all(0),
              titleTextStyle: TextStyle(fontSize: 18),
              leftChevronIcon: Icon(Icons.chevron_left),
              rightChevronIcon: Icon(Icons.chevron_right),
            ),
          ),
          SizedBox(height: 20),
          const Text(
            'Créneaux horaires disponibles',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 10),
          if (_selectedDay != null)
            Text(
              'Date sélectionnée : ${_selectedDay!.day}/${_selectedDay!.month}/${_selectedDay!.year}',
              style: TextStyle(fontSize: 16),
            )
          else
            Text('Aucune date sélectionnée'),
        ],
      ),
    );
  }
}
*/