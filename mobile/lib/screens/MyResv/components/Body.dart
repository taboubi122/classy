import 'dart:typed_data';
import 'package:cool_alert/cool_alert.dart';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shop_app/screens/reservation/reservation.dart';
import '../../../adresse.dart';
import '../../../service.dart';
import '../../details/details_screen.dart';
import 'package:intl/intl.dart';
import 'package:intl/date_symbol_data_local.dart';

class Body extends StatefulWidget {
  final int CIN;

  Body({
    Key? key,
    required this.CIN,
  }) : super(key: key);

  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  String? email;

  @override
  void initState() {
    super.initState();
    getEmail();
  }

  final dio = Dio();

  void showConfirmationDialog(salon resev) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Confirmation'),
          content: const Text('Voulez-vous supprimer cet élément ?'),
          actions: [
            TextButton(
              child: const Text('Annuler'),
              onPressed: () {
                Navigator.of(context).pop(); // Ferme la boîte de dialogue
              },
            ),
            TextButton(
              child: const Text('Supprimer'),
              onPressed: () {
                delete(resev);
                Navigator.of(context).pop(); // Ferme la boîte de dialogue
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> delete(salon resev) async {
    try {
      await dio.delete(
        'http://${Adresse.adresseIP}:5000/api/deleteResv/${resev.resvREF}',
      );
      print('Suppression réussie');
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
            builder: (BuildContext context) => Body(
                  CIN: widget.CIN,
                )),
      );
    } catch (e) {
      print('Échec de la suppression : $e');
      CoolAlert.show(
        context: context,
        type: CoolAlertType.error,
        title: 'Erreur',
        text: 'Échec de la suppression',
      );
    }
  }

  String formatDuration(String duration) {
    final parts = duration.split(':');
    final hours = int.parse(parts[0]);
    final minutes = int.parse(parts[1]);
    final seconds = int.parse(parts[2]);

    if (hours > 0) {
      return '$hours h';
    } else if (minutes > 0) {
      return '$minutes min';
    } else {
      return '$seconds s';
    }
  }

  String formatDate(String dateString) {
    initializeDateFormatting('fr', null);
    DateTime date = DateTime.parse(dateString);
    String formattedDate =
        DateFormat("EEEE d MMMM 'à' HH:mm", 'fr').format(date);
    return formattedDate;
  }

  Future<List<dynamic>> getItems(int CIN) async {
    try {
      final response = await dio
          .get('http://${Adresse.adresseIP}:5000/api/getResvClientCIN/$CIN');
      final dynamic data = response.data;
      print(data);
      if (data != null) {
        if (data is List) {
          final items = data
              .map((itemJson) =>
                  salon.fromJson(itemJson as Map<String, dynamic>))
              .toList();
          return items;
        } else {
          throw Exception('Invalid data format. Expected a List.');
        }
      } else {
        throw Exception('No data available.');
      }
    } catch (e) {
      throw Exception('Failed to get items: $e');
    }
  }

  Future<void> getEmail() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      email = prefs.getString('email');
    });
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.white,
          centerTitle: true,
          elevation: 3,
          title: const Text(
            "Mes réservations",
            style: TextStyle(
              color: Color.fromARGB(255, 15, 15, 15),
              fontSize: 14,
            ),
          ),
          leading: IconButton(
            icon: const Icon(
              Icons.arrow_back_ios_new,
              color: Colors.black,
              size: 20,
            ),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
        ),
        body: buildPageRes(MediaQuery.of(context).size.width),
      ),
    );
  }

  Widget buildPageRes(double width) => Scaffold(
        body: SafeArea(
          child: SingleChildScrollView(
            physics: const ScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(height: 5),
                  FutureBuilder<List<dynamic>>(
                    future: getItems(widget.CIN),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(
                          child: CircularProgressIndicator(),
                        );
                      } else if (snapshot.hasError) {
                        return Text('${snapshot.error}');
                      } else {
                        final reservations = snapshot.data;
                        return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: reservations?.length,
                          itemBuilder: (context, index) {
                            final reservation = reservations![index];
                            return GestureDetector(
                              onTap: () {
                                Navigator.pushNamed(
                                  context,
                                  DetailsScreen.routeName,
                                  arguments: salonDetailsArguments(
                                    reference: reservation.refCentre,
                                    nomCentre: reservation.nom,
                                  ),
                                );
                              },
                              child: Container(
                                height:
                                    185, // Adjust the height according to your needs
                                child: Card(
                                  clipBehavior: Clip.antiAlias,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(15),
                                  ),
                                  elevation:
                                      2, // Add elevation for the box shadow
                                  color: const Color.fromARGB(217, 255, 255,
                                      255), // Set the background color
                                  child: Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Expanded(
                                          child: Padding(
                                        padding: const EdgeInsets.only(top: 10),
                                        child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Center(
                                                child: Text(
                                                  reservation.nom,
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 16,
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: const EdgeInsets.only(
                                                  top: 10,
                                                  bottom: 10,
                                                  left: 10,
                                                ),
                                                child: MyImageWidget(
                                                    imageBytes:
                                                        reservation.src),
                                              )
                                            ]),
                                      )),
                                      Expanded(
                                        child: Padding(
                                          padding: const EdgeInsets.all(10),
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                "${formatDate(reservation.startDateResv)}",
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 14,
                                                ),
                                              ),
                                              Text(reservation.nomService),
                                              Row(
                                                children: [
                                                  const Icon(
                                                      Icons.schedule_outlined,
                                                      size: 13),
                                                  const SizedBox(
                                                    width: 2,
                                                  ),
                                                  Text(
                                                      "${formatDuration(reservation.duree)}"),
                                                  const SizedBox(
                                                    width: 6,
                                                  ),
                                                  const Icon(
                                                      Icons
                                                          .monetization_on_outlined,
                                                      size: 13),
                                                  const SizedBox(
                                                    width: 2,
                                                  ),
                                                  Text("${reservation.prix}D"),
                                                ],
                                              ),
                                              Padding(
                                                  padding:
                                                      const EdgeInsets.only(
                                                    left: 45,
                                                  ),
                                                  child: Row(
                                                    children: [
                                                      cardButtonsModif(
                                                          reservation),
                                                      cardButtonsSupp(
                                                          reservation),
                                                    ],
                                                  ))
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        );
                      }
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      );

  Widget cardButtonsModif(salon salon) {
    return ElevatedButton(
      onPressed: () async {
        Navigator.pushNamed(
          context,
          reservation.routeName,
          arguments: salonReservation(
            refCentre: salon.refCentre,
            nomCentre: salon.nom,
            nomService: salon.nomService,
            refResv: salon.resvREF,
          ),
        );
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white,
        padding: const EdgeInsets.all(6),
        minimumSize: Size.zero,
      ),
      child: const Row(
        children: [
          Icon(
            Icons.edit,
            color: Colors.black,
            size: 13,
          ),
          SizedBox(width: 1),
          Text(
            "",
            style: TextStyle(color: Colors.black, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget cardButtonsSupp(salon resev) {
    return ElevatedButton(
      onPressed: () {
        showConfirmationDialog(resev);
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white,
        padding: const EdgeInsets.all(6),
        minimumSize: Size.zero,
      ),
      child: const Row(
        children: [
          Icon(
            Icons.delete_forever,
            color: Colors.black,
            size: 13,
          ),
          SizedBox(width: 1),
          Text(
            "",
            style: TextStyle(color: Colors.black, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

class MyImageWidget extends StatelessWidget {
  final Uint8List imageBytes;

  MyImageWidget({required this.imageBytes});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(15),
      child: Image.memory(
        imageBytes,
        fit: BoxFit.cover,
        height: 80,
        width: 140,
      ),
    );
  }
}
