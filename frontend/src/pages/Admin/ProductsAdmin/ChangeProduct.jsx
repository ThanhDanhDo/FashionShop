import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Upload,
  Modal,
  Tag,
  Spin,
  Image
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './FormProduct.css';
import { getProductById, uploadProductImage, deleteProductImage, updateProduct } from '../../../services/productService';
import { getAllProducts } from '../../../services/productService';

const { TextArea } = Input;

// Danh sách màu cố định
const colorList = [
  'Beige', 'Black', 'Blue', 'Brown', 'Dark Gray', 'Dark Green', 'Gray', 'Green',
  'Khaki', 'Light Green', 'Natural', 'Navy', 'Olive', 'Orange', 'Pink', 'Purple',
  'Red', 'White', 'Wine', 'Yellow', 'Light Gray'
];

// Tạo options cho Select Color
const colorOptions = colorList.map(color => ({
  value: color,
  label: color,
}));

// Map màu cho tag
const customColorMap = {
  'Pink': '#ffb6c1',
  'Beige': '#f5f5dc',
  'Dark Gray': '#595959',
  'Light Gray': '#d3d3d3',
  'Dark Green': '#006400',
  'Khaki': '#f0e68c',
  'Light Green': '#90ee90',
  'Natural': '#e6e2d3',
  'White': '#ffffff',
  'Wine': '#722f37',
  'Yellow': '#ffe066',
  'Black': '#222222',
  'Blue': '#1677ff',
  'Brown': '#a0522d',
  'Gray': '#808080',
  'Green': '#52c41a',
  'Navy': '#001f3f',
  'Olive': '#808000',
  'Orange': '#fa8c16',
  'Purple': '#722ed1',
  'Red': '#ff4d4f',
};

const whiteTextColors = [
  'Wine', 'Dark Gray', 'Black', 'Blue', 'Brown', 'Navy', 'Olive', 'Purple', 'Red'
];
const darkTextColors = [
  'Beige', 'Khaki', 'Light Green', 'Natural', 'White', 'Yellow', 'Pink', 'Light Gray'
];

// Size options và thứ tự
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
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const bgColor = customColorMap[value] || value;
  let textColor = '#fff';
  if (darkTextColors.includes(value)) textColor = '#222';
  if (whiteTextColors.includes(value)) textColor = '#fff';
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
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

const ChangeProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
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
        console.error('Error fetching product:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, form]);

  const onFinish = (values) => {
    setShowModal(true);
  };

  const handleConfirmChange = async () => {
    const values = form.getFieldsValue();
    const mainCatObj = categoryData.find(c => c.id === values.mainCategory);
    const subCatObj = categoryData.find(c => c.id === values.subCategory);

    const submitValues = {
      ...values,
      imgurls: imgUrls,
      mainCategory: { id: values.mainCategory, name: mainCatObj?.name || '' },
      subCategory: { id: values.subCategory, name: subCatObj?.name || '' }
    };
    try {
      await updateProduct(submitValues);
      setShowModal(false);
      navigate('/Products-admin');
    } catch (e) {
      alert('Update failed!');
    }
  };

  const handleCancelChange = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    navigate('/Products-admin');
  };

  const handleSizeChange = (vals) => {
    const sorted = vals.slice().sort(sortSize);
    form.setFieldsValue({ size: sorted });
  };

  // Xử lý upload ảnh
  const handleImageUpload = async ({ file }) => {
    const url = await uploadProductImage(file);
    const newUrls = [...imgUrls, url];
    setImgUrls(newUrls);
    form.setFieldsValue({ imgurls: newUrls });
  };

  // Xóa ảnh
  const handleRemoveImage = async (url) => {
    await deleteProductImage(url);
    const newUrls = imgUrls.filter(u => u !== url);
    setImgUrls(newUrls);
    form.setFieldsValue({ imgurls: newUrls });
  };

  // Hàm mở preview
  const handlePreviewImage = (url) => {
    setPreviewImage(url);
    setPreviewOpen(true);
  };

  return (
    <div className="change-product" style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Change Product</h1>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ width: '100%' }}
        >
          <div className="form-container">
            <div className="form-column">
              <h3>Basic Information</h3>
              <div className="row">
                <Form.Item label="Product ID" name="id">
                  <Input disabled />
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
                  />
                </Form.Item>
              </div>
              <div className="row">
                <Form.Item label="Product Name" name="name" rules={[{ required: true, message: 'Please enter product name' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Stock" name="stock" rules={[{ required: true, message: 'Please enter stock' }]}>
                  <InputNumber min={0} style={{ width: '100%' }} onChange={value => setStock(value)} />
                </Form.Item>
              </div>
              <div className="row">
              <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please select gender' }]}>
                  <Select options={genderOptions} />
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
              </div>
              <div className="row">
                <Form.Item
                  label="Main Category"
                  name="mainCategory"
                  rules={[{ required: true, message: 'Please select main category' }]}
                >
                  <Select
                    options={mainCategories.map(c => ({ value: c.id, label: c.name }))}
                    onChange={value => {
                      setMainCategory(value);
                      form.setFieldsValue({ subCategory: undefined });
                    }}
                    placeholder="Select main category"
                  />
                </Form.Item>
                <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter price' }]}>
                  <Input />
                </Form.Item>
              </div>
              <div className="row">
                <Form.Item
                  label="Sub Category"
                  name="subCategory"
                  rules={[{ required: true, message: 'Please select sub category' }]}
                >
                  <Select
                    options={subCategories.map(c => ({
                      value: c.id,
                      label: c.name
                    }))}
                    placeholder="Select sub category"
                    disabled={!mainCategory}
                  />
                </Form.Item>
                <Form.Item
                  label="Size"
                  name="size"
                  rules={[{ required: true, message: 'Please select size' }]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Select size"
                    options={sizeOptions}
                    value={form.getFieldValue('size')?.slice().sort(sortSize)}
                    onChange={handleSizeChange}
                  />
                </Form.Item>
              </div>
              <div className="row">
              <Form.Item label="Descriptions" name="description" rules={[{ required: true, message: 'Please enter description' }]}>
                  <TextArea rows={4} />
                </Form.Item>
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
                        <Button
                          size="small"
                          style={{ position: 'absolute', top: 2, right: 2, zIndex: 2 }}
                          danger
                          onClick={() => handleRemoveImage(url)}
                        >x</Button>
                      </div>
                    ))}
                  </div>
                  <div style={{ margin: '8px 0' }}>
                    <Upload
                      showUploadList={false}
                      customRequest={handleImageUpload}
                      accept="image/*"
                      multiple={false}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </div>
                  <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>
                    Recommended size: 500x500 px
                  </div>
                  <Image
                    style={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      src: previewImage,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      )}
      <div className="action-bar">
        <Button className="cancel-button" onClick={handleCancel} style={{ marginRight: 10 }}>
          Cancel
        </Button>
        <Button className="save-button" type="primary" htmlType="submit" onClick={() => form.submit()}>
          Save Changes
        </Button>
      </div>
      <Modal
        open={showModal}
        onCancel={handleCancelChange}
        onOk={handleConfirmChange}
        okText="Change"
        cancelText="No"
        title="Are you sure you want to save these changes?"
      />
    </div>
  );
};

export default ChangeProduct;