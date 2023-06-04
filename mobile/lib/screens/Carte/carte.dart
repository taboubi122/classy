import 'dart:convert';
import 'dart:typed_data';
import 'package:permission_handler/permission_handler.dart';
import 'package:geolocator/geolocator.dart';
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:latlong2/latlong.dart';
import 'package:shop_app/screens/seeMoreCentre/seeMoreCentre.dart';

import '../../../constants/app_constants.dart';
import '../../../salon2.dart';
import '../../adresse.dart';
import '../details/details_screen.dart';

class CartePage extends StatefulWidget {
  const CartePage({Key? key}) : super(key: key);

  @override
  State<CartePage> createState() => _CartePageState();
}

final dio = Dio();

class _CartePageState extends State<CartePage> with TickerProviderStateMixin {
  final pageController = PageController();
  int selectedIndex = -1;
  late Position cl;
  late final MapController mapController;
  List<salon> mapMarkers = [];
  List<salon> searchResults = []; // Liste des résultats de recherche

  @override
  void initState() {
    super.initState();
    getItemsFromApi();
    mapController = MapController();
  }

  Future getPostion() async {
    LocationPermission per;
    per = await Geolocator.checkPermission();
    if (per == LocationPermission.denied) {
      per = await Geolocator.requestPermission();
      if (per == LocationPermission.always) {
        getLatLong();
      }
      if (per == LocationPermission.whileInUse) {}
    }
    print("our permission");
    print(per);
  }

  Future<Position> getLatLong() async {
    return await Geolocator.getCurrentPosition().then((value) => value);
  }

  Future<void> getItemsFromApi() async {
    try {
      final response =
          await dio.get('http://${Adresse.adresseIP}:5000/api/getLocalisation');
      final List<dynamic> data = response.data;
      final items = data
          .map((itemJson) => salon.fromJson(itemJson as Map<String, dynamic>))
          .toList();

      cl = await getLatLong(); // Attendre la récupération de la position

      setState(() {
        mapMarkers = items;
        mapMarkers.add(
          salon(
            reference: data.length + 1,
            nom: 'Ma position',
            adresse: '',
            latitude: cl.latitude,
            longitude: cl.longitude,
          ),
        );
        searchResults = mapMarkers;
      });
    } catch (e) {
      print('Failed to get items: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          FlutterMap(
            mapController: mapController,
            options: MapOptions(
              minZoom: 5,
              maxZoom: 18,
              zoom: 11,
              center:
                  LatLng(36.8065, 10.1815), // Position initiale de la caméra
            ),
            layers: [
              TileLayerOptions(
                urlTemplate:
                    "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}",
                additionalOptions: {
                  'accessToken': AppConstants.mapBoxAccessToken,
                },
              ),
              MarkerLayerOptions(markers: [
                for (int i = 0; i < searchResults.length; i++)
                  Marker(
                    height: 40,
                    width: 40,
                    point: LatLng(
                        searchResults[i].latitude, searchResults[i].longitude),
                    builder: (BuildContext context) {
                      if (searchResults[i].nom == "Ma position") {
                        // Votre position actuelle
                        return Icon(
                          Icons.location_on,
                          color: Colors.red,
                          size: 30,
                        );
                      } else {
                        // Les autres marqueurs
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              selectedIndex = i;
                            });
                          },
                          child: Icon(
                            Icons.location_on,
                            color: selectedIndex == i
                                ? Colors.white
                                : Colors.black,
                            size: 30,
                          ),
                        );
                      }
                    },
                  ),
              ]),
            ],
          ),
          Positioned(
            top: 10.0,
            right: 70.0,
            left: 70.0,
            child: ElevatedButton(
              onPressed: () async {
                if (getPostion() != null) {
                  cl = await getLatLong();
                  print(cl.latitude);
                  print(cl.longitude);
                  mapController.move(
                    LatLng(cl.latitude,
                        cl.longitude), // Mettre à jour la position de la caméra
                    mapController.zoom, // Conserver le zoom actuel
                  );
                  setState(() {
                    selectedIndex = -1; // Réinitialiser la sélection du marker
                  });
                }
              },
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(50, 30), // Taille minimale de 50x30
                primary: Colors.white, // Background blanc
                onPrimary: Colors.black, // Texte noir
              ),
              child: const Text('Trouver des centres proches',
                  style: TextStyle(fontSize: 14, fontFamily: "Robot")),
            ),
          ),
          if (selectedIndex != -1)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 60, vertical: 50),
                child: Container(
                  height: 80, // Ajuster la hauteur selon vos besoins
                  child: Card(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        InkWell(
                          onTap: () {
                            Navigator.pushNamed(
                              context,
                              DetailsScreen.routeName,
                              arguments: salonDetailsArguments(
                                  reference:
                                      searchResults[selectedIndex].reference,
                                  nomCentre: searchResults[selectedIndex].nom),
                            );
                          },
                          child: Padding(
                            padding: const EdgeInsets.all(9),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Espacement entre l'icône et le texte
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      searchResults[selectedIndex].nom,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                      ),
                                    ),
                                    Text(
                                      searchResults[selectedIndex].adresse,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        const Icon(
                          Icons.keyboard_arrow_right_rounded,
                          color: Colors.black,
                          size: 35,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
