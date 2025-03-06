const types = [
    "النيابة الكلية", "نيابة قسم اول الجزئية", "نيابة قسم ثاني الجزئية",
    "نيابة مركز المنصورة", "نيابة طلخا", "نيابة السنبلاوين",
    "نيابة اجا", "نيابة ميت غمر", "نيابة تمي الامديد"
  ];
  
  export const archives = types.map((text, index) => ({
    text,
    linkTo: `management?type=${text}`,
    img: `egypt ${index + 1}.jpg`
  }));
  