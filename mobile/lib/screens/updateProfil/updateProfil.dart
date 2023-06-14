import 'dart:io';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shop_app/screens/MyResv/MyResv.dart';
import 'package:image_picker/image_picker.dart';
import '../../adresse.dart';
import '../../client.dart';
import '../profile/components/profile_menu.dart';

class updateProfil extends StatefulWidget {
  static String routeName = "/update";

  @override
  _updateProfilState createState() => _updateProfilState();
}

class _updateProfilState extends State<updateProfil> {
  String? email;
  var _image;
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

  Future<void> updateClient() async {
    try {
      await dio.put('http://${Adresse.adresseIP}:5000/api/updateClient/$email',
          data: {});
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

  Future getPhoto() async {
    ImagePicker _picker = ImagePicker();
    // Pick an image
    XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    setState(() {
      if (image != null) {
        _image = File(image.path);
      } else {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text("No image Selected")));
      }
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
                "Mon Compte ",
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
            body: SafeArea(
                child: SingleChildScrollView(
                    physics: const ScrollPhysics(),
                    child: Padding(
                        padding: const EdgeInsets.all(15),
                        child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const SizedBox(height: 8),
                              FutureBuilder<List<client>>(
                                future: getClient(),
                                builder: (context, snapshot) {
                                  if (snapshot.connectionState ==
                                      ConnectionState.waiting) {
                                    return const Center(
                                      child: CircularProgressIndicator(),
                                    );
                                  } else if (snapshot.hasError) {
                                    return Text('${snapshot.error}');
                                  } else {
                                    final client = snapshot.data![0];
                                    return SingleChildScrollView(
                                      padding: EdgeInsets.symmetric(
                                          vertical: 20, horizontal: 70),
                                      child: Column(
                                        children: [
                                          SizedBox(
                                            height: 100,
                                            width: 100,
                                            child: Stack(
                                              fit: StackFit.expand,
                                              clipBehavior: Clip.none,
                                              children: [
                                                MyImageWidget(
                                                    imageBytes: client.photo),
                                                Positioned(
                                                  right: -16,
                                                  bottom: 0,
                                                  child: SizedBox(
                                                    height: 46,
                                                    width: 46,
                                                    child: TextButton(
                                                      style:
                                                          TextButton.styleFrom(
                                                        shape:
                                                            RoundedRectangleBorder(
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(50),
                                                          side: BorderSide(
                                                              color:
                                                                  Colors.white),
                                                        ),
                                                        primary: Colors.white,
                                                        backgroundColor:
                                                            const Color(
                                                                0xFFF5F6F9),
                                                      ),
                                                      onPressed: () {
                                                        getPhoto();
                                                      },
                                                      child: SvgPicture.asset(
                                                          "assets/icons/Camera Icon.svg"),
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          SizedBox(height: 15),
                                          CupertinoTextField(
                                            prefix: const Padding(
                                              padding:
                                                  EdgeInsets.only(left: 15),
                                            ),
                                            padding: EdgeInsets.all(15),
                                            placeholder: '${client.prenom} ',
                                            style: const TextStyle(
                                                color: Colors.white),
                                            decoration: const BoxDecoration(
                                              color:
                                                  Color.fromARGB(16, 0, 0, 0),
                                              borderRadius: BorderRadius.all(
                                                  Radius.circular(10)),
                                            ),
                                          ),
                                          SizedBox(height: 8),
                                          CupertinoTextField(
                                            prefix: const Padding(
                                              padding:
                                                  EdgeInsets.only(left: 15),
                                            ),
                                            padding: EdgeInsets.all(15),
                                            placeholder: '${client.nom} ',
                                            style: const TextStyle(
                                                color: Colors.white),
                                            decoration: const BoxDecoration(
                                              color:
                                                  Color.fromARGB(16, 0, 0, 0),
                                              borderRadius: BorderRadius.all(
                                                  Radius.circular(10)),
                                            ),
                                          ),
                                          SizedBox(height: 8),
                                          CupertinoTextField(
                                            prefix: const Padding(
                                              padding:
                                                  EdgeInsets.only(left: 15),
                                            ),
                                            padding: EdgeInsets.all(15),
                                            placeholder: '${client.tel} ',
                                            style: const TextStyle(
                                                color: Colors.white),
                                            decoration: const BoxDecoration(
                                              color:
                                                  Color.fromARGB(16, 0, 0, 0),
                                              borderRadius: BorderRadius.all(
                                                  Radius.circular(10)),
                                            ),
                                          ),
                                        ],
                                      ),
                                    );
                                  }
                                },
                              )
                            ]))))));
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
