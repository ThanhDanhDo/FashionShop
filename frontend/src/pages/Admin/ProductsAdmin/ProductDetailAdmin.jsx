import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, InputNumber, Tag, Spin, Image, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './FormProduct.css';
import { getProductById } from '../../../services/productService';

const { TextArea } = Input;

const colorList = [
  'Beige', 'Black', 'Blue', 'Brown', 'Dark Gray', 'Dark Green', 'Gray', 'Green',
  'Khaki', 'Light Green', 'Natural', 'Navy', 'Olive', 'Orange', 'Pink', 'Purple',
  'Red', 'White', 'Wine', 'Yellow', 'Light Gray'
];
const colorOptions = colorList.map(color => ({ value: color, label: color }));
const customColorMap = {
  'Pink': '#ffb6c1', 'Beige': '#f5f5dc', 'Dark Gray': '#595959', 'Light Gray': '#d3d3d3',
  'Dark Green': '#006400', 'Khaki': '#f0e68c', 'Light Green': '#90ee90', 'Natural': '#e6e2d3',
  'White': '#ffffff', 'Wine': '#722f37', 'Yellow': '#ffe066', 'Black': '#222222',
  'Blue': '#1677ff', 'Brown': '#a0522d', 'Gray': '#808080', 'Green': '#52c41a',
  'Navy': '#001f3f', 'Olive': '#808000', 'Orange': '#fa8c16', 'Purple': '#722ed1', 'Red': '#ff4d4f',
};
const whiteTextColors = [
  'Wine', 'Dark Gray', 'Black', 'Blue', 'Brown', 'Navy', 'Olive', 'Purple', 'Red'
];
const darkTextColors = [
  'Beige', 'Khaki', 'Light Green', 'Natural', 'White', 'Yellow', 'Pink', 'Light Gray'
];
const sizeOrder = ['XS', 'S', 'M', 'L', 'XL'];
const sizeOptions = sizeOrder.map(size => ({ value: size, label: size }));
const sortSize = (a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b);

const categoryData = [
  { id: 1, name: "Outerwear", parent_id: null },
  { id: 2, name: "T-shirt", parent_id: null },
  { id: 3, name: "Shirt", parent_id: null },
  { id: 4, name: "Dress", parent_id: null },
  { id: 5, name: "Bottom", parent_id: null },
  { id: 6, name: "Accessories", parent_id: null },
  { id: 7, name: "Jackets & Blazers", parent_id: "1" },
  { id: 8, name: "Coats", parent_id: "1" },
  { id: 9, name: "Short-sleeve T-shirt", parent_id: "2" },
  { id: 10, name: "Short-sleeve Shirt", parent_id: "3" },
  { id: 11, name: "Long-sleeve T-shirt", parent_id: "2" },
  { id: 12, name: "Long-sleeve Shirt", parent_id: "3" },
  { id: 13, name: "Skirts", parent_id: "4" },
  { id: 14, name: "Dresses", parent_id: "4" },
  { id: 15, name: "Long", parent_id: "5" },
  { id: 16, name: "Short", parent_id: "5" },
  { id: 17, name: "Bags", parent_id: "6" },
  { id: 18, name: "Belts", parent_id: "6" }
];
const genderOptions = [
  { value: 'Men', label: 'Men' },
  { value: 'Women', label: 'Women' },
  { value: 'Unisex', label: 'Unisex' },
];
const tagRenderColor = (props) => {
  const { label, value } = props;
  const bgColor = customColorMap[value] || value;
  let textColor = '#fff';
  if (darkTextColors.includes(value)) textColor = '#222';
  if (whiteTextColors.includes(value)) textColor = '#fff';
  return (
    <Tag
      style={{
        marginInlineEnd: 4,
        minWidth: 60,
        textAlign: 'center',
        textTransform: 'capitalize',
        background: bgColor,
        color: textColor,
        border: 'none',
      }}
    >
      {label}
    </Tag>
  );
};

const ProductDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [mainCategory, setMainCategory] = useState();
  const [stock, setStock] = useState(0);
  const [imgUrls, setImgUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const mainCategories = categoryData.filter(c => c.parent_id === null);
  const subCategories = categoryData.filter(c => c.parent_id === String(mainCategory));

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const fetchedProduct = await getProductById(id);
        form.setFieldsValue({
          id: fetchedProduct.id,
          name: fetchedProduct.name,
          description: fetchedProduct.description,
          mainCategory: fetchedProduct.mainCategory?.id || fetchedProduct.mainCategoryId,
          subCategory: fetchedProduct.subCategory?.id || fetchedProduct.subCategoryId,
          gender: fetchedProduct.gender,
          size: Array.isArray(fetchedProduct.size) ? fetchedProduct.size : [],
          color: Array.isArray(fetchedProduct.color) ? fetchedProduct.color : [],
          stock: fetchedProduct.stock,
          price: fetchedProduct.price,
          imgurls: fetchedProduct.imgurls || [],
        });
        setMainCategory(fetchedProduct.mainCategory?.id || fetchedProduct.mainCategoryId);
        setStock(fetchedProduct.stock);
        setImgUrls(fetchedProduct.imgurls || []);
      } catch (e) {
        // Xử lý lỗi nếu cần
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, form]);

  // Hàm mở preview
  const handlePreviewImage = (url) => {
    setPreviewImage(url);
    setPreviewOpen(true);
  };

  return (
    <div className="change-product" style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'relative' }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          fontSize: 22,
          zIndex: 10,
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 16
        }}
        onClick={() => navigate(-1)}
      />
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Product Detail</h1>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="form-container">
          <div className="left-column">
            <h3>Basic Information</h3>
            <Form
              form={form}
              layout="vertical"
              style={{ width: '100%' }}
            >
              <Form.Item label="Product ID" name="id">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Product Name" name="name">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Descriptions" name="description">
                <TextArea rows={4} readOnly />
              </Form.Item>
              <Form.Item
                label="Main Category"
                name="mainCategory"
              >
                <Select
                  options={mainCategories.map(c => ({ value: c.id, label: c.name }))}
                  open={false}
                />
              </Form.Item>
              <Form.Item
                label="Sub Category"
                name="subCategory"
              >
                <Select
                  options={subCategories.map(c => ({
                    value: c.id,
                    label: c.name
                  }))}
                  open={false}
                />
              </Form.Item>
              <Form.Item label="Gender" name="gender">
                <Select options={genderOptions} open={false} />
              </Form.Item>
            </Form>
          </div>
          <div className="right-column">
            <Form
              form={form}
              layout="vertical"
              style={{ width: '100%' }}
            >
              <Form.Item label="Product Images" name="imgurls" className="product-images-label">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {imgUrls.map(url => (
                    <div key={url} style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={url}
                        alt="product"
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee', cursor: 'pointer' }}
                        onClick={() => handlePreviewImage(url)}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
                  Recommended size: 500x500 px
                </div>
                {/* Preview modal */}
                <Image
                  style={{ display: 'none' }}
                  preview={{
                    visible: previewOpen,
                    src: previewImage,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                  }}
                />
              </Form.Item>
              <Form.Item label="Stock" name="stock">
                <InputNumber min={0} style={{ width: '100%' }} readOnly />
              </Form.Item>
              <Form.Item label="Status">
                <span
                  style={{
                    color: stock > 0 ? '#52c41a' : '#f5222d',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: 4,
                    background: stock > 0 ? '#f6ffed' : '#fff1f0',
                    border: `1px solid ${stock > 0 ? '#b7eb8f' : '#ffa39e'}`,
                    display: 'inline-block',
                    minWidth: 90,
                    textAlign: 'center'
                  }}
                >
                  {stock > 0 ? 'In stock' : 'Out of stock'}
                </span>
              </Form.Item>
              <Form.Item label="Price" name="price">
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label="Size"
                name="size"
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Select size"
                  options={sizeOptions}
                  value={form.getFieldValue('size')?.slice().sort(sortSize)}
                  tagRender={props => (
                    <Tag style={{ marginInlineEnd: 4 }}>{props.label}</Tag>
                  )}
                  open={false}
                />
              </Form.Item>
              <Form.Item label="Color" name="color">
                <Select
                  mode="multiple"
                  tagRender={tagRenderColor}
                  style={{ width: '100%' }}
                  placeholder="Select color"
                  options={colorOptions}
                  showSearch
                  optionFilterProp="label"
                  open={false}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailAdmin;