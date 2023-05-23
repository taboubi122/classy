import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:dio/dio.dart';
import 'package:shop_app/screens/details/details_screen.dart';
import 'dart:async';
import '../../salon.dart';

final dio = Dio();
Future<List<salon>> getItems() async {
  try {
    final response = await dio.get('http://192.168.1.39:5000/api/getNamesEtab');
    final List<dynamic> data = response.data;
    final items = data
        .map((itemJson) => salon.fromJson(itemJson as Map<String, dynamic>))
        .toList();
    return items;
  } catch (e) {
    throw Exception('Failed to get items: $e');
  }
}

class seeMoreCentre extends StatelessWidget {
  const seeMoreCentre({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
        length: 2,
        child: Scaffold(
            appBar: PreferredSize(
              preferredSize: const Size.fromHeight(90.0),
              child: AppBar(
                backgroundColor: Colors.white,
                centerTitle: true,
                elevation: 3,
                bottom: const TabBar(
                    indicatorColor: Colors.black,
                    indicatorWeight: 1,
                    tabs: [
                      Tab(
                        child: Text('Résultats',
                            style: TextStyle(color: Colors.black)),
                      ),
                      Tab(
                        child: Text('Carte',
                            style: TextStyle(color: Colors.black)),
                      )
                    ]),
                title: const Text(
                  "Centres",
                  style: TextStyle(
                      color: Color.fromARGB(255, 15, 15, 15),
                      fontFamily: 'Times',
                      fontSize: 14),
                ),
                leading: IconButton(
                  icon: const Icon(
                    Icons.arrow_back_ios_new,
                    color: Colors.black,
                    size: 14,
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                ),
              ),
            ),
            body: TabBarView(
              children: [
                buildPageRes(MediaQuery.of(context).size.width),
                buildPageCart(),
              ],
            )));
  }

  Widget buildPageCart() => Scaffold();

  Widget buildPageRes(width) => Scaffold(
        body: SafeArea(
          child: SingleChildScrollView(
            physics: const ScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CupertinoTextField(
                    prefix: Padding(
                      padding: EdgeInsets.only(left: 15),
                      child: Icon(Icons.search),
                    ),
                    padding: EdgeInsets.all(15),
                    placeholder: 'Chercher votre centre',
                    style: TextStyle(color: Colors.white),
                    decoration: BoxDecoration(
                      color: Color.fromARGB(16, 0, 0, 0),
                      borderRadius: BorderRadius.all(Radius.circular(5)),
                    ),
                  ),
                  const SizedBox(height: 5),
                  FutureBuilder<List<salon>>(
                    future: getItems(),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(
                          child: CircularProgressIndicator(),
                        );
                      } else if (snapshot.hasError) {
                        return Center(
                          child: Text('Error: ${snapshot.error}'),
                        );
                      } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                        return const Center(
                          child: Text('No data available.'),
                        );
                      } else {
                        final salons = snapshot.data!;
                        return ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: salons.length,
                          itemBuilder: (context, index) => salon2Card(
                            salons[index],
                            index,
                            () {
                              Navigator.pushNamed(
                                context,
                                DetailsScreen.routeName,
                                arguments: salonDetailsArguments(
                                    reference: salons[index].reference),
                              );
                            },
                          ),
                          separatorBuilder: (context, index) =>
                              const SizedBox(height: 10),
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
}

Widget salon2Card(salon salon, int index, tap) {
  return GestureDetector(
    onTap: tap,
    child: Container(
      height: 200, // Ajustez la hauteur en fonction de vos besoins
      child: Card(
        clipBehavior: Clip.antiAlias,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            MyImageWidget(imageBytes: salon.src),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(15),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      salon.nom,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    Text(salon.type),
                    const Spacer(),
                    const Text('Waiting time: 2hrs'),
                    Text(
                      'Se ferme à 22h',
                      style: TextStyle(color: Colors.redAccent[100]),
                    ),
                    Row(
                      children: [
                        cardButtons(Icons.call, 'Appeler'),
                        cardButtons(Icons.location_on, 'Map'),
                        const Spacer(),
                        Text(
                          '21 km',
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

Widget cardButtons(IconData iconData, String label) {
  return Padding(
    padding: const EdgeInsets.only(right: 10),
    child: ElevatedButton(
      onPressed: () {},
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.black,
        padding: const EdgeInsets.all(5),
        minimumSize: Size.zero,
      ),
      child: Row(
        children: [
          Icon(iconData, size: 16),
          const SizedBox(width: 2),
          Text(label)
        ],
      ),
    ),
  );
}

class Indicator extends StatelessWidget {
  const Indicator({Key? key, required this.isActive}) : super(key: key);

  final bool isActive;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 4,
      width: 8,
      decoration: BoxDecoration(
        color: isActive ? Colors.white : Colors.white54,
        borderRadius: const BorderRadius.all(Radius.circular(12)),
      ),
    );
  }
}

Widget salonCard(salon salon, int index) => Hero(
      tag: salon.reference.toString(),
      child: Material(
        child: Container(
          height: 300,
          width: 350,
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: AspectRatio(
                  aspectRatio: 1.84,
                  child: Stack(
                    alignment: Alignment.bottomCenter,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: MyImageWidget(imageBytes: salon.src),
                      ),
                      const Positioned(
                        bottom: 10,
                        right: 70,
                        child: Indicator(
                          isActive: false,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(
                  left: 30.0,
                  right: 8.0,
                  top: 10.0,
                ),
                child: Column(
                  children: [
                    SizedBox(
                      width: 350,
                      height: 24,
                      child: Text(
                        salon.nom,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(
                      height: 5,
                    ),
                    const SizedBox(
                      width: 350,
                      height: 24,
                      child: Text(
                        "This salon is here for you!",
                        style: TextStyle(
                          fontWeight: FontWeight.w400,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );

class MyImageWidget extends StatelessWidget {
  final Uint8List imageBytes;

  MyImageWidget({required this.imageBytes});

  @override
  Widget build(BuildContext context) {
    return Image.memory(
      imageBytes,
      fit: BoxFit.cover,
      height: 193,
      width: 140,
    );
  }
}
