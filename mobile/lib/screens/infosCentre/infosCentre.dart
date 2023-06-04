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

class InfosCentre extends StatefulWidget {
  final int reference;
  final String nomCentre;
  const InfosCentre(
      {Key? key, required this.reference, required this.nomCentre})
      : super(key: key);

  @override
  State<InfosCentre> createState() => _InfosCentreState();
}

final dio = Dio();

class _InfosCentreState extends State<InfosCentre>
    with TickerProviderStateMixin {
  final pageController = PageController();
  int selectedIndex = -1;
  late Position cl;
  late final MapController mapController;
  List<salon> mapMarkers = [];
  List<salon> searchResults = []; // Liste des résultats de recherche
  List<dynamic> horaire = []; // Liste des horaires

  @override
  void initState() {
    super.initState();
    getItemsFromApi();
    getHorairesFromApi();
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
      final response = await dio.get(
          'http://${Adresse.adresseIP}:5000/api/getLocalisationCentre/${widget.reference}');
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

  Future<void> getHorairesFromApi() async {
    try {
      final response = await dio.get(
          'http://${Adresse.adresseIP}:5000/api/getHoraireCentre/${widget.nomCentre}');
      final dynamic data = response.data;
      print(data);
      if (data != null) {
        setState(() {
          horaire = data as List<dynamic>;
        });
      } else {
        throw Exception('No data available.');
      }
    } catch (e) {
      throw Exception('Failed to get item: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: FractionallySizedBox(
              child: FlutterMap(
                mapController: mapController,
                options: MapOptions(
                  minZoom: 5,
                  maxZoom: 18,
                  zoom: 11,
                  center: LatLng(
                      36.8065, 10.1815), // Position initiale de la caméra
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
                          searchResults[i].latitude,
                          searchResults[i].longitude,
                        ),
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
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.all(16),
              color: Colors.white,
              child: Column(
                children: [
                  Text(
                    'Horaires',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 16),
                  if (horaire.isEmpty)
                    Text('Aucun horaire disponible')
                  else
                    ListView.builder(
                      shrinkWrap: true,
                      itemCount: horaire.length,
                      itemBuilder: (context, index) {
                        return Row(
                          children: [
                            Expanded(
                              child: Text(
                                '${horaire[index]['jour']} :',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            Expanded(
                              child: Text(
                                horaire[index]['ouverture'] != null
                                    ? '${horaire[index]['ouverture']} - ${horaire[index]['fermeture']}'
                                    : 'Fermé',
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
