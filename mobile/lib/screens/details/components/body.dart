import 'package:flutter/material.dart';
import 'package:shop_app/screens/details/components/head.dart';
import 'package:shop_app/screens/infosCentre/infosCentre.dart';
import 'package:shop_app/size_config.dart';
import 'product_description.dart';
import 'product_images.dart';

class Body extends StatefulWidget {
  final int reference;
  final String nomCentre;

  const Body({Key? key, required this.reference, required this.nomCentre})
      : super(key: key);

  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> with TickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(90.0),
          child: AppBar(
            backgroundColor: Colors.white,
            centerTitle: true,
            elevation: 3,
            bottom: TabBar(
              indicatorColor: Colors.black,
              indicatorWeight: 1,
              tabs: [
                Tab(
                  child: Text('Prendre RDV',
                      style: TextStyle(color: Colors.black)),
                ),
                Tab(
                  child: Text('Offrir', style: TextStyle(color: Colors.black)),
                ),
                Tab(
                  child: Text('Avis', style: TextStyle(color: Colors.black)),
                ),
                Tab(
                  child:
                      Text('A propos', style: TextStyle(color: Colors.black)),
                )
              ],
              controller: _tabController,
            ),
            title: const Text(
              "CLASSY",
              style: TextStyle(
                  color: Color.fromARGB(255, 15, 15, 15), fontSize: 14),
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
            buildPageAvis(),
            buildPageOffre(),
            buildPageProp(),
          ],
          controller: _tabController,
        ),
      ),
    );
  }

  Widget buildPageAvis() => Scaffold();
  Widget buildPageProp() => Scaffold(
        body: InfosCentre(
            reference: widget.reference, nomCentre: widget.nomCentre),
      );
  Widget buildPageOffre() => Scaffold();

  Widget buildPageRes(width) => ListView(
        children: [
          Container(
            color: Color.fromARGB(100, 236, 236, 236),
            child: Column(
              children: [
                head(reference: widget.reference, nomCentre: widget.nomCentre),
                SizedBox(height: 5),
                ProductImages(reference: widget.reference),
                SizedBox(height: 5),
                Padding(
                  padding: EdgeInsets.only(
                    left: getProportionateScreenWidth(12),
                    right: getProportionateScreenWidth(12),
                  ),
                  child: ElevatedButton(
                    onPressed: () {
                      _tabController.animateTo(
                          1); // Redirige vers l'onglet "Offrir" (index 1)
                    },
                    style: ElevatedButton.styleFrom(
                      primary: Colors.white, // Fond blanc
                      onPrimary: Colors.black, // Texte noir
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(5), // Bordure arrondie
                        side: BorderSide(
                          color: Colors.black,
                          width: 0.5, // Largeur de la bordure réduite
                        ),
                      ),
                    ),
                    child: Padding(
                      padding: EdgeInsets.all(8.0), // Espacement autour du Row
                      child: Row(
                        mainAxisAlignment:
                            MainAxisAlignment.center, // Centrer le contenu
                        children: [
                          Icon(
                            Icons.wallet_giftcard_rounded,
                            size: 14,
                          ),
                          SizedBox(
                              width:
                                  4), // Espacement horizontal entre l'icône et le texte
                          Text(
                            "Offrir",
                            style: TextStyle(color: Colors.black, fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                ProductDescription(
                  reference: widget.reference,
                  nomCentre: widget.nomCentre,
                  pressOnSeeMore: () {},
                ),
                Container(
                  color: const Color(0xFFF6F7F9),
                  child: Column(
                    children: [
                      Container(
                        color: Colors.white,
                        child: Padding(
                          padding: EdgeInsets.only(
                            left: SizeConfig.screenWidth * 0.15,
                            right: SizeConfig.screenWidth * 0.15,
                            bottom: getProportionateScreenWidth(40),
                            top: getProportionateScreenWidth(15),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      );
}
