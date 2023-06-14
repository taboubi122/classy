import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:calendar_agenda/calendar_agenda.dart';

import '../../../adresse.dart';

class Calendrier extends StatefulWidget {
  final String nomService;
  final String nomCentre;
  final int refCentre;
  final Function(DateTime) onReservation;

  Calendrier({
    Key? key,
    required this.refCentre,
    required this.nomService,
    required this.nomCentre,
    required this.onReservation,
  }) : super(key: key);

  @override
  _CalendrierState createState() => _CalendrierState();
}

class _CalendrierState extends State<Calendrier> {
  CalendarAgendaController _calendarAgendaControllerAppBar =
      CalendarAgendaController();
  final dio = Dio();
  List<DateTime> _selectedDays = []; // Dates sélectionnées
  List<String> _selectedDayHours =
      []; // Heures de travail pour la date sélectionnée
  bool _isSundaySelected = false;

  Map<int, List<String>> _workingHoursPerDay = {};

  Future<void> getItem() async {
    try {
      final response = await dio.get(
          'http://${Adresse.adresseIP}:5000/api/heureCalendrier/${widget.refCentre}');
      final dynamic data = response.data;

      if (data != null && data is List<dynamic>) {
        _workingHoursPerDay.clear();
        for (dynamic item in data) {
          String day = item['jour'];
          String? openingHour = item['ouverture'];
          String? closingHour = item['fermeture'];
          int? dayOfWeek = _getDayOfWeek(day);
          if (dayOfWeek != null &&
              (openingHour != null || closingHour != null)) {
            String hourRange = _formatHourRange(openingHour, closingHour);
            _workingHoursPerDay[dayOfWeek] =
                _workingHoursPerDay[dayOfWeek] ?? [];
            _workingHoursPerDay[dayOfWeek]!.add(hourRange);
          }
        }
      } else {
        throw Exception('No valid data available.');
      }
    } catch (e) {
      throw Exception('Failed to get item: $e');
    }
  }

  Future<void> getResvPerso() async {
    try {
      final response = await dio.get(
        'http://${Adresse.adresseIP}:5000/api/getAllpersonnelResv',
        queryParameters: {
          'nomService': widget.nomService,
          'nomCentre': widget.nomCentre,
        },
      );

      if (response.statusCode == 200) {
        var data = response.data;
        // Faites quelque chose avec les données retournées
      } else {
        print('Erreur lors de la récupération des données.');
      }
    } catch (error) {
      print('Erreur lors de la requête HTTP : $error');
    }
  }

  Future<List<dynamic>> getReservation() async {
    try {
      final response = await Dio().get(
          'http://${Adresse.adresseIP}:5000/api/getReservationMobile/${widget.refCentre}');
      final data = response.data;

      return data;
    } catch (error) {
      print('Erreur lors de la requête HTTP : $error');
      throw error;
    }
  }

  int? _getDayOfWeek(String day) {
    switch (day) {
      case 'Lundi':
        return 1;
      case 'Mardi':
        return 2;
      case 'Mercredi':
        return 3;
      case 'Jeudi':
        return 4;
      case 'Vendredi':
        return 5;
      case 'Samedi':
        return 6;
      case 'Dimanche':
        return 7;
      default:
        return null;
    }
  }

  String _formatHourRange(String? openingHour, String? closingHour) {
    String formattedOpeningHour =
        openingHour != null ? openingHour.substring(0, 5) : '';
    String formattedClosingHour =
        closingHour != null ? closingHour.substring(0, 5) : '';
    return '$formattedOpeningHour - $formattedClosingHour';
  }

  @override
  void initState() {
    super.initState();

    getItem().then((_) {
      DateTime now = DateTime.now();
      int dayOfWeek = now.weekday;
      _updateSelectedDayHours(dayOfWeek);
    });
  }

  void _updateSelectedDayHours(int dayOfWeek) {
    setState(() {
      _selectedDayHours = _workingHoursPerDay[dayOfWeek] ?? [];
      _isSundaySelected = (dayOfWeek == 7);
    });
  }

  List<String> _generateAllHours() {
    List<String> allHours = [];
    for (int i = 0; i < 24; i++) {
      for (int j = 0; j < 60; j += 30) {
        String hour =
            '${i.toString().padLeft(2, '0')}:${j.toString().padLeft(2, '0')}';
        allHours.add(hour);
      }
    }
    return allHours;
  }

  Future<bool> isReservationExists(
      String selectedDateTime, String selectedTime) async {
    String dateS;
    dateS = selectedDateTime.toString().split(" ").first;
    final List<String> dateParts = dateS.split('-');
    final int year = int.parse(dateParts[0]);
    final int month = int.parse(dateParts[1]);
    final int day = int.parse(dateParts[2]);

    final DateTime selectedDateTimeModified = DateTime(
      year,
      month,
      day,
      int.parse(selectedTime.split(':')[0]),
      int.parse(selectedTime.split(':')[1]),
    );

    final reservations = await getReservation();

    return reservations.any((reservation) {
      final DateTime startDateResv =
          DateTime.parse(reservation['startDateResv']);
      final DateTime endDateResv = DateTime.parse(reservation['endDateResv']);

      // Vérifier si selectedDateTimeModified est inclus dans l'intervalle
      return selectedDateTimeModified.year == startDateResv.year &&
          selectedDateTimeModified.month == startDateResv.month &&
          selectedDateTimeModified.day == startDateResv.day &&
          (selectedDateTimeModified.isAtSameMomentAs(startDateResv) ||
              selectedDateTimeModified.isAtSameMomentAs(endDateResv));
    });
  }

  DateTime? dateSelect;
  @override
  Widget build(BuildContext context) {
    List<String> allHours = _generateAllHours();
    final DateTime currentDate = DateTime.now();
    final int page = 0;
    final int index = 0;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(
          height: 5,
        ),
        CalendarAgenda(
          controller: _calendarAgendaControllerAppBar,
          appbar: false,
          selectedDayPosition: SelectedDayPosition.center,
          weekDay: WeekDay.short,
          dayNameFontSize: 12,
          dayNumberFontSize: 16,
          dayBGColor: Colors.grey.withOpacity(0.15),
          titleSpaceBetween: 15,
          backgroundColor: Colors.transparent,
          fullCalendarScroll: FullCalendarScroll.horizontal,
          fullCalendarDay: WeekDay.short,
          selectedDateColor: Colors.white,
          dateColor: Colors.black,
          locale: 'fr',
          initialDate: DateTime.now(),
          calendarEventColor: TColor.primaryColor2,
          firstDate: DateTime.now().subtract(const Duration(days: 140)),
          lastDate: DateTime.now().add(const Duration(days: 60)),
          onDateSelected: (date) {
            int dayOfWeek = date.weekday;
            setState(() {
              dateSelect = date;
            });
            _updateSelectedDayHours(dayOfWeek);
            print(date);
          },
          selectedDayLogo: Container(
            width: double.maxFinite,
            height: double.maxFinite,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: TColor.primaryG,
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        ),
        const SizedBox(height: 20),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),
            Center(
              child: Wrap(
                spacing: 10,
                children: _selectedDayHours.isEmpty
                    ? [Text('Pas d\'horaires disponibles')]
                    : _selectedDayHours.expand((hourRange) {
                        List<String> hours = hourRange.split(' - ');
                        String openingHour = hours[0];
                        String closingHour = hours[1];
                        int openingHourIndex = allHours.indexOf(openingHour);
                        int closingHourIndex = allHours.indexOf(closingHour);
                        return allHours
                            .sublist(openingHourIndex, closingHourIndex + 1)
                            .map((hour) {
                          String dateS;
                          if (dateSelect == null) {
                            dateS = DateTime.now().toString().split(" ").first;
                          } else {
                            dateS = dateSelect.toString().split(" ").first;
                          }
                          return FutureBuilder<bool>(
                            future: isReservationExists(dateS, hour),
                            builder: (BuildContext context,
                                AsyncSnapshot<bool> snapshot) {
                              if (snapshot.connectionState ==
                                  ConnectionState.waiting) {
                                return CircularProgressIndicator();
                              } else if (snapshot.hasError) {
                                print(
                                    'Erreur lors de la vérification de la réservation : ${snapshot.error}');
                                return Text(
                                    'Erreur lors de la vérification de la réservation');
                              } else {
                                final bool isDisabled = snapshot.data ?? false;
                                return ElevatedButton(
                                  onPressed: () {
                                    DateTime selectedDateTime =
                                        DateTime.parse('$dateS $hour');
                                    widget.onReservation(selectedDateTime);
                                  },
                                  style: ElevatedButton.styleFrom(
                                    padding: EdgeInsets.symmetric(
                                        vertical: 8, horizontal: 16),
                                    primary:
                                        isDisabled ? Colors.grey : Colors.white,
                                    onPrimary: Colors.black,
                                  ),
                                  child: Text(
                                    hour,
                                    style: TextStyle(
                                      color: isDisabled
                                          ? Colors.white
                                          : Colors.black,
                                      fontSize: 14,
                                    ),
                                  ),
                                );
                              }
                            },
                          );
                        }).toList();
                      }).toList(),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class TColor {
  static Color get primaryColor1 => Color.fromARGB(255, 0, 2, 12);
  static Color get primaryColor2 => Color.fromARGB(255, 166, 166, 167);

  static Color get secondaryColor1 => const Color(0xffC58BF2);
  static Color get secondaryColor2 => const Color(0xffEEA4CE);

  static List<Color> get primaryG => [primaryColor2, primaryColor1];
  static List<Color> get secondaryG => [secondaryColor2, secondaryColor1];

  static Color get black => const Color(0xff1D1617);
  static Color get gray => const Color(0xff786F72);
  static Color get white => Colors.white;
  static Color get lightGray => const Color(0xffF7F8F8);
}
