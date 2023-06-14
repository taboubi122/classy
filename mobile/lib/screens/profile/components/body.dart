import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shop_app/screens/MyResv/MyResv.dart';
import 'package:shop_app/screens/updateProfil/updateProfil.dart';

import '../../../adresse.dart';
import '../../../client.dart';
import 'profile_menu.dart';

class Body extends StatefulWidget {
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
  Future<List<client>> getClient() async {
    try {
      final response = await dio
          .get('http://${Adresse.adresseIP}:5000/api/getInfosClient/$email');
      final List<dynamic> data = response.data;
      final items = data
          .map((itemJson) => client.fromJson(itemJson as Map<String, dynamic>))
          .toList();
      return items;
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

  void Deconnecter(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    // Supprimez l'e-mail enregistré dans les préférences partagées
    await prefs.remove('email');

    Navigator.pushNamedAndRemoveUntil(context, '/splash', (route) => false);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<client>>(
      future: getClient(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        } else if (snapshot.hasError) {
          return Text('${snapshot.error}');
        } else {
          final client = snapshot.data![0];
          return SingleChildScrollView(
            padding: EdgeInsets.symmetric(vertical: 20),
            child: Column(
              children: [
                SizedBox(
                  height: 100,
                  width: 100,
                  child: Stack(
                    fit: StackFit.expand,
                    clipBehavior: Clip.none,
                    children: [
                      MyImageWidget(imageBytes: client.photo),
                    ],
                  ),
                ),

                SizedBox(height: 15),
                Text('${client.nom} ${client.prenom}'), // Display client's name
                Text(email ?? ""),
                SizedBox(height: 10),
                ProfileMenu(
                  text: "Compte",
                  icon: "assets/icons/User Icon.svg",
                  press: () {
                    Navigator.pushNamed(
                      context,
                      updateProfil.routeName,
                    );
                  },
                ),

                ProfileMenu(
                  text: "Reservation",
                  icon: "assets/icons/calendar-svgrepo-com.svg",
                  press: () {
                    Navigator.pushNamed(
                      context,
                      MyResv.routeName,
                      arguments: salonReservation(
                        CIN: client.CIN,
                      ),
                    );
                  },
                ),
                ProfileMenu(
                  text: "Notifications",
                  icon: "assets/icons/Bell.svg",
                  press: () {},
                ),
                ProfileMenu(
                  text: "Parametre",
                  icon: "assets/icons/Settings.svg",
                  press: () {},
                ),

                ProfileMenu(
                  text: "Deconnecter",
                  icon: "assets/icons/Log out.svg",
                  press: () {
                    Deconnecter(context);
                  },
                ),
              ],
            ),
          );
        }
      },
    );
  }
}

class MyImageWidget extends StatelessWidget {
  final Uint8List imageBytes;

  MyImageWidget({required this.imageBytes});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(50),
      child: Image.memory(
        imageBytes,
        fit: BoxFit.cover,
        height: 193,
        width: 140,
      ),
    );
  }
}
